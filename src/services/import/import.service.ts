import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, chromium } from '@playwright/test';
import { Queue } from 'bull';
import { MediaType, QueueTypes } from '../../util/enums';
import { AssetsService } from '../assets';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { DownloaderService } from '../downloader/downloader.service';
import { UsersRepository } from '../postgres/repositories';
import { headerPools } from '../service.constants';
import { CreateImportInput, CreateImportQueueInput } from './dto/create-import.dto';
import { UploadMediaOutput } from './dto/upload-media.out';

@Injectable()
export class ImportService {
  private logger = new Logger(ImportService.name);
  private visitedAnchors = new Set<string>();

  constructor(
    @InjectQueue(QueueTypes.UPLOAD_QUEUE)
    private uploadQueue: Queue<CreateImportQueueInput>,
    private usersRepository: UsersRepository,
    private assetsService: AssetsService,
    private documentSelectorService: DocumentSelectorService,
    private downloaderService: DownloaderService,
    private configService: ConfigService,
  ) {}

  public async initiate(creatorId: string, input: CreateImportInput): Promise<string> {
    const { hasBranch, url, fileType, totalContent, qualityType, subDirectory } = input;
    const creator = await this.usersRepository.findOneOrFail({ where: { id: creatorId } });

    this.logger.log({
      message: 'Importing started',
      hasBranch,
      url,
      creatorId: creator.id,
      fileType,
      totalContent,
      qualityType,
      subDirectory,
    });

    this.visitedAnchors.clear();
    await this.uploadQueue.add({ creatorId, ...input });
    return 'Added job';
  }

  public async handleImport(input: CreateImportQueueInput) {
    const { hasBranch } = input;
    const browser = await chromium.connect(this.configService.getOrThrow<string>('PLAYWRIGHT_DO_ACCESS_KEY'));
    this.logger.log({ message: 'Browser is initialized' });
    // const browser = await chromium.launch({ headless: true });

    try {
      return hasBranch ? await this.importBranches(browser, input) : await this.importSingleBranch(browser, input);
    } catch (error) {
      this.logger.error('❌ Import failed', error);
      throw error;
    } finally {
      this.logger.log({ message: 'DONE' });
      await browser.close();
    }
  }

  private async sleep() {
    const delay = Math.floor(Math.random() * 1500) + 2000;
    return await new Promise((res) => setTimeout(res, delay));
  }

  private async importSingleBranch(browser: Browser, input: CreateImportQueueInput): Promise<UploadMediaOutput[]> {
    const { url, creatorId, qualityType } = input;

    this.logger.log({ VISITING: 'SINGLE BRANCH' });
    if (this.visitedAnchors.has(url)) {
      this.logger.log(`Skipping already visited: ${url}`);
      return [];
    }
    this.visitedAnchors.add(url);

    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch {
      this.logger.warn(`Navigation timeout for ${url}, falling back to domcontentloaded`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    const urls = await this.documentSelectorService.getContentUrls(page, qualityType);
    const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

    this.logger.log('Filtered image urls: ', filteredUrls);
    this.logger.log(`Found ${filteredUrls.length} images`);

    const result = await this.handleUpload(filteredUrls, url, creatorId);

    await page.close();
    return result;
  }

  private async handleUpload(filteredUrls: string[], url: string, creatorId: string) {
    const assets: UploadMediaOutput[] = [];
    for (const link of filteredUrls) {
      this.logger.log('URL ➡️', link);
      try {
        await this.sleep();
        const buffer = await this.downloaderService.fetch(link, url);
        const mimeType = this.documentSelectorService.resolveMimeType(link);
        const filename = this.documentSelectorService.createFileName(link);

        if (buffer === null) throw new Error('Axios error:: RETURNING');

        const uploaded = await this.assetsService.uploadFileV2(
          creatorId,
          filename,
          MediaType.PROFILE_MEDIA,
          buffer,
          mimeType,
        );
        assets.push(uploaded);
        this.logger.log(`Left posts to be downloaded: ${filteredUrls.length - filteredUrls.indexOf(link)}`);
      } catch (err) {
        this.logger.log('❌ FAILED TO SAVE!', link, err?.message);
      }
    }
    return assets;
  }

  private async handleFilter(branchUrls: string[], url: string, subDirectory?: string): Promise<string[]> {
    let filteredUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(branchUrls, url, subDirectory);

    this.logger.log({ filteredUrls });

    filteredUrls = [...new Set(filteredUrls)].filter((a) => !this.visitedAnchors.has(a));

    this.logger.log({ alteredUrls: filteredUrls });

    return filteredUrls;
  }

  private async importBranches(browser: Browser, input: CreateImportQueueInput): Promise<UploadMediaOutput[]> {
    const { url, subDirectory } = input;
    this.logger.log({ VISITING: 'MULTIPLE BRANCH' });

    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch {
      this.logger.warn(`Navigation timeout for ${url}, falling back to domcontentloaded`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    const branchUrls = await this.documentSelectorService.getAnchors(page);
    this.logger.log({ branchUrls });

    const filteredUrls = await this.handleFilter(branchUrls, url, subDirectory);

    await page.close();
    this.logger.log({ 'ANCHORS FOUND': filteredUrls, 'filteredUrlsLength': filteredUrls.length });

    const results: UploadMediaOutput[] = [];
    for (const anchor of filteredUrls) {
      try {
        this.logger.log({ VISITING: anchor });
        this.logger.log({ 'Left anchors to be visited': filteredUrls.length - filteredUrls.indexOf(anchor) });

        const uploaded = await this.importSingleBranch(browser, { ...input, url: anchor });
        results.push(...uploaded);
      } catch (error) {
        this.logger.error({ '❌ Error processing anchor': anchor });
        this.logger.error(error);
      }
    }
    return results;
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
