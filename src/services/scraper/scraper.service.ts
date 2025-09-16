import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectCore, PuppeteerCore } from 'nestjs-pptr';
import { Browser, Page } from 'puppeteer';
import { AssetsService } from '../assets';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { DownloaderService } from '../downloader/downloader.service';
import { UsersRepository } from '../postgres/repositories';
import { headerPools, MediaType, QueueTypes } from '../service.constants';
import { CreateScrapeInput, CreateScrapeQueueInput } from './dto/create-scrape.dto';
import { UploadMediaOutput } from './dto/upload-media.out';

@Injectable()
export class ScraperService {
  private logger = new Logger(ScraperService.name);

  constructor(
    @InjectQueue(QueueTypes.UPLOAD_QUEUE)
    private uploadQueue: Queue<CreateScrapeQueueInput>,
    private usersRepository: UsersRepository,
    private assetsService: AssetsService,
    private documentSelectorService: DocumentSelectorService,
    private downloaderService: DownloaderService,
    @InjectCore() private readonly puppeteer: PuppeteerCore,
  ) {}

  public async initiate(creatorId: string, input: CreateScrapeInput): Promise<string> {
    const { hasBranch, url, fileType, totalContent, qualityType, subDirectory } = input;
    const creator = await this.usersRepository.findOneOrFail({ where: { id: creatorId } });

    this.logger.log({
      message: 'Scraping started',
      hasBranch,
      url,
      creatorId: creator.id,
      email: creator.username,
      fileType,
      totalContent,
      qualityType,
      subDirectory,
    });

    await this.uploadQueue.add({ creatorId, ...input });

    return 'Added job';
  }

  public async handleScrape(input: CreateScrapeQueueInput) {
    const { hasBranch } = input;

    const instance = await this.puppeteer.launch('default');

    try {
      return hasBranch
        ? await this.scrapeBranches(instance.browser, input)
        : await this.scrapeSingle(instance.browser, input);
    } finally {
      this.logger.log({ message: 'DONE' });
      await this.puppeteer.destroy(instance);
    }
  }

  private async sleep() {
    const delay = Math.floor(Math.random() * 1500) + 2000;
    return new Promise((res) => setTimeout(res, delay));
  }

  private async scrapeSingle(browser: Browser, input: CreateScrapeQueueInput): Promise<UploadMediaOutput[]> {
    this.logger.log({ message: 'Single Scraping' });
    const { url, creatorId, fileType, qualityType } = input;

    const page: Page = await browser.newPage();
    await page.setExtraHTTPHeaders(this.getRandomHeaders(url));
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const items = await this.documentSelectorService.handleFileType(page, fileType, qualityType);

    this.logger.log(items, items.length);

    const results: UploadMediaOutput[] = [];
    for (const link of items) {
      try {
        await this.sleep();
        const buffer = await this.downloaderService.fetch(link, url);
        const mimeType = this.documentSelectorService.resolveMimeType(link);
        const filename = this.documentSelectorService.createFileName(link);

        const uploaded = await this.assetsService.uploadFileV2(
          creatorId,
          filename,
          MediaType.PROFILE_MEDIA,
          buffer,
          mimeType,
        );

        results.push(uploaded);
      } catch (err) {
        this.logger.error(`Failed scraping ${link}`, err);
      }
    }

    await page.close();
    return results;
  }

  private async scrapeBranches(browser: Browser, input: CreateScrapeQueueInput): Promise<UploadMediaOutput[]> {
    const { url } = input;

    const page: Page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const branchUrls = await this.documentSelectorService.getAnchors(page);
    await page.close();

    const hostBasedAnchorUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(
      branchUrls,
      url,
      input.subDirectory,
    );
    // TODO: add total content method later, for now initiate with as many request possible
    const results: UploadMediaOutput[] = [];
    for (const branchUrl of hostBasedAnchorUrls) {
      const uploaded = await this.scrapeSingle(browser, { ...input, url: branchUrl });
      results.push(...uploaded);
    }
    return results;
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
