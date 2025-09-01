import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { InjectCore, PuppeteerCore, PuppeteerInstance } from 'nestjs-pptr';
import { extname } from 'path';
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
    @InjectQueue(QueueTypes.UPLOAD_QUEUE) private uploadQueue: Queue<CreateScrapeQueueInput>,
    private usersRepository: UsersRepository,
    private assetsService: AssetsService,
    private documentSelectorService: DocumentSelectorService,
    private downloaderService: DownloaderService,
    @InjectCore() private readonly puppeteer: PuppeteerCore,
  ) {}

  public async initiate(creatorId: string, input: CreateScrapeInput) {
    const { hasBranch, url } = input;
    this.logger.log({ message: 'Scraping started', hasBranch, url });

    await this.uploadQueue.add({ creatorId, ...input });
  }

  public async handleScrape(input: CreateScrapeQueueInput) {
    const { creatorId, hasBranch, url } = input;
    const { browser }: PuppeteerInstance = await this.puppeteer.launch('new_example');

    try {
      return hasBranch
        ? await this.scrapeBranches(browser, url, creatorId)
        : await this.scrapeSingle(browser, url, creatorId);
    } finally {
      this.logger.log({ message: 'DONE' });
    }
  }

  private async sleep() {
    const delay = Math.floor(Math.random() * 1500) + 2000;
    return new Promise((res) => setTimeout(res, delay));
  }

  private async scrapeSingle(browser: Browser, url: string, creatorId: string): Promise<UploadMediaOutput[]> {
    this.logger.log({ message: 'Single Scraping' });

    const page: Page = await browser.newPage();
    await page.setExtraHTTPHeaders(this.getRandomHeaders(url));
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const anchors = await this.documentSelectorService.getAnchors(page);
    const filtered = this.documentSelectorService.filterByExtension(anchors);

    this.logger.log(filtered, filtered.length);

    const results: UploadMediaOutput[] = [];
    for (const link of filtered.slice(0, 5)) {
      try {
        await this.sleep();
        const buffer = await this.downloaderService.fetch(link, url);
        const mimeType = this.resolveMimeType(link);
        const filename = this.createFileName(link);
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

  private async scrapeBranches(browser: Browser, url: string, creatorId: string): Promise<UploadMediaOutput[]> {
    const page: Page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const branchUrls = await this.documentSelectorService.getAnchors(page);
    await page.close();

    const results: UploadMediaOutput[] = [];
    for (const branchUrl of branchUrls) {
      const uploaded = await this.scrapeSingle(browser, branchUrl, creatorId);
      results.push(...uploaded);
    }
    return results;
  }

  private resolveMimeType(url: string): string {
    const ext = extname(url).substring(1);
    return ext ? `image/${ext}` : 'application/octet-stream';
  }

  private createFileName(link: string) {
    return `public_${randomUUID()}${extname(link)}`;
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
