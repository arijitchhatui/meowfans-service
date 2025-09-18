import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
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

  constructor(
    @InjectQueue(QueueTypes.UPLOAD_QUEUE)
    private uploadQueue: Queue<CreateImportQueueInput>,
    private usersRepository: UsersRepository,
    private assetsService: AssetsService,
    private documentSelectorService: DocumentSelectorService,
    private downloaderService: DownloaderService,
  ) {}

  public async initiate(creatorId: string, input: CreateImportInput): Promise<string> {
    const { hasBranch, url, fileType, totalContent, qualityType, subDirectory } = input;
    const creator = await this.usersRepository.findOneOrFail({ where: { id: creatorId } });

    console.log({
      message: 'Importing started',
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

  // async onModuleInit() {
  //   await this.uploadQueue.add({
  //     // message: 'Importing started',
  //     hasBranch: true,
  //     url: 'https://wallhaven.cc/tag/1405',
  //     creatorId: 'a446d922-ed3c-4a23-b1e8-9d9059b7710c',
  //     // email: 'spider',
  //     fileType: FileType.IMAGE,
  //     // fileType: 'image',
  //     totalContent: 0,
  //     qualityType: DocumentQualityType.LOW_DEFINITION,
  //     subDirectory: '1405',
  //   });
  // }

  public async handleImport(input: CreateImportQueueInput) {
    const { hasBranch } = input;
    const browser = await chromium.connect('ws://api.meowfans.app/meowfans-service-playwright/');
    // const browser = await chromium.connect('ws://0.0.0.0:3003/');

    try {
      return hasBranch ? await this.importBranches(browser, input) : await this.importSingleBranch(browser, input);
    } finally {
      console.log({ message: 'DONE' });
      await browser.close();
    }
  }

  private async sleep() {
    const delay = Math.floor(Math.random() * 1500) + 2000;
    return await new Promise((res) => setTimeout(res, delay));
  }

  private async importSingleBranch(browser: Browser, input: CreateImportQueueInput): Promise<UploadMediaOutput[]> {
    const { url, creatorId, qualityType } = input;

    const context: BrowserContext = await browser.newContext({
      extraHTTPHeaders: this.getRandomHeaders(url),
    });
    const page: Page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    const urls = await this.documentSelectorService.getContentUrls(page, qualityType);
    const filteredUrls = this.documentSelectorService.filterByExtension(urls);

    console.log('Filtered image urls: ', filteredUrls);
    console.log(`Found ${filteredUrls.length} images`);

    const result = await this.handleUpload(filteredUrls, url, creatorId);

    await context.close();
    return result;
  }

  private async handleUpload(filteredUrls: string[], url: string, creatorId: string) {
    const assets: UploadMediaOutput[] = [];
    for (const link of filteredUrls) {
      console.log('URL ➡️', link);
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
        assets.push(uploaded);
        console.log(`Left posts to be downloaded: ${filteredUrls.length - filteredUrls.indexOf(link)}`);
      } catch {
        console.log('❌ FAILED TO SAVE!', url);
      }
    }
    return assets;
  }

  private async importBranches(browser: Browser, input: CreateImportQueueInput): Promise<UploadMediaOutput[]> {
    const { url, subDirectory } = input;

    const context = await browser.newContext();
    const page: Page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    const branchUrls = await this.documentSelectorService.getAnchors(page);
    const filteredUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(branchUrls, url, subDirectory);

    await page.close();
    await context.close();

    console.log('ANCHORS FOUND: ', filteredUrls, filteredUrls.length);

    const results: UploadMediaOutput[] = [];
    for (const anchor of filteredUrls) {
      try {
        console.log('VISITING:', anchor);
        console.log('Left anchors to be visited: %d\n', filteredUrls.length - filteredUrls.indexOf(anchor));

        const uploaded = await this.importSingleBranch(browser, { ...input, url: anchor });
        results.push(...uploaded);
      } catch (error) {
        console.error(`❌ Error processing anchor : ${anchor}`, error);
      }
    }
    return results;
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
