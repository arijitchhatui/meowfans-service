import { DocumentQualityType } from '@app/enums';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { MediaType } from 'libs/enums/media-type';
import { QueueTypes } from 'libs/enums/queue-type';
import { InjectCore, PuppeteerCore } from 'nestjs-pptr';
import { Browser, Page } from 'puppeteer';
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
    @InjectCore() private readonly puppeteer: PuppeteerCore,
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

  public async handleImport(input: CreateImportQueueInput) {
    const { hasBranch } = input;

    const instance = await this.puppeteer.launch('default', { headless: true });

    try {
      return hasBranch
        ? await this.importBranches(instance.browser, input)
        : await this.importSingleBranch(instance.browser, input);
    } finally {
      console.log({ message: 'DONE' });
      await this.puppeteer.destroy(instance);
    }
  }

  private async sleep() {
    const delay = Math.floor(Math.random() * 1500) + 2000;
    return await new Promise((res) => setTimeout(res, delay));
  }

  private async importSingleBranch(browser: Browser, input: CreateImportQueueInput): Promise<UploadMediaOutput[]> {
    const { url, creatorId } = input;

    const page: Page = await browser.newPage();
    await page.setExtraHTTPHeaders(this.getRandomHeaders(url));
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const urls = await this.documentSelectorService.getImageUrls(page, DocumentQualityType.HIGH_DEFINITION);
    const filteredUrls = this.documentSelectorService.filterByExtension(urls);

    console.log(`Found ${filteredUrls.length} images`);

    return await this.handleUpload(filteredUrls, url, creatorId);
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

    const page: Page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const branchUrls = await this.documentSelectorService.getAnchors(page);

    const filteredUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(branchUrls, url, subDirectory);

    await page.close();
    console.log('ANCHORS FOUND: ', filteredUrls, filteredUrls.length);

    // TODO: add total content method later, for now initiate with as many request possible
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
