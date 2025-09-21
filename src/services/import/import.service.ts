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
import { VaultsService } from '../vaults';
import { CreateImportInput, CreateImportQueueInput } from './dto/create-import.dto';

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
    private vaultsService: VaultsService,
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
    const { hasBranch, creatorId } = input;
    const browser = await chromium.connect(this.configService.getOrThrow<string>('PLAYWRIGHT_DO_ACCESS_KEY'));

    this.logger.log({ BROWSER_INITIATE_MESSAGE: 'Browser is initialized', BROWSER_VERSION: browser.version() });

    try {
      const imageUrls = hasBranch
        ? await this.importProfile(browser, input)
        : await this.importSingleBranch(browser, input);

      await this.handleUploadToVault(creatorId, imageUrls);
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
    return new Promise((res) => setTimeout(res, delay));
  }

  private async importSingleBranch(browser: Browser, input: CreateImportQueueInput) {
    const { url, qualityType } = input;

    const page = await browser.newPage();
    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn(`Navigation timeout for ${url}, fallback to DOMContentLoaded`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
      this.logger.log({ VISITING_SINGLE_BRANCH_URL: url });

      const urls = await this.documentSelectorService.getContentUrls(page, qualityType);

      const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

      this.logger.log(`Filtered images count: ${filteredUrls.length}`);

      return filteredUrls;
    } finally {
      await page.close();
    }
  }

  private async handleUpload(filteredUrls: string[], url: string, creatorId: string) {
    for (const link of filteredUrls) {
      try {
        await this.sleep();
        const buffer = await this.downloaderService.fetch(link, url);
        const mimeType = this.documentSelectorService.resolveMimeType(link);
        const filename = this.documentSelectorService.createFileName(link);

        if (!buffer) throw new Error('Axios error :: RETURNING');

        await this.assetsService.uploadFileV2(creatorId, filename, MediaType.PROFILE_MEDIA, buffer, mimeType);
        await this.vaultsService.updateStatusToFulfilledState(creatorId, link);

        this.logger.log(`Downloaded & uploaded: ${link}`);
      } catch (err) {
        this.logger.error('❌ FAILED TO SAVE!', link, err?.message);
      }
    }
  }

  private async handleUploadToVault(creatorId: string, filteredUrls: string[]) {
    await this.vaultsService.bulkInsert(creatorId, { urls: filteredUrls });
  }

  private async handleFilter(branchUrls: string[], url: string, subDirectory?: string): Promise<string[]> {
    const filteredUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(branchUrls, url, subDirectory);
    return Array.from(new Set(filteredUrls));
  }

  public async importProfile(browser: Browser, input: CreateImportQueueInput) {
    const { url, subDirectory } = input;
    const page = await browser.newPage();
    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      const anchorUrls = await this.documentSelectorService.getAnchors(page);
      const allQueryUrls = anchorUrls.filter((url) => url.includes(`/user/${subDirectory}?o=`));
      const queryUrls = Array.from(new Set(allQueryUrls)).slice(1);
      this.logger.log({ queryUrls });

      const imageUrls = await this.handleQueryUrls(browser, input, queryUrls);

      this.logger.log({ imageUrls });
      return imageUrls;
    } finally {
      await page.close();
    }
  }

  private async handleQueryUrls(browser: Browser, input: CreateImportQueueInput, queryUrls: string[]) {
    const imageUrls: string[] = [];

    for (const queryUrl of queryUrls) {
      const page = await browser.newPage();
      try {
        try {
          await page.goto(queryUrl, { waitUntil: 'networkidle', timeout: 30000 });
        } catch {
          await page.goto(queryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        }
        this.logger.log({
          VISITING_QUERY_URL: queryUrl,
          LEFT_QUERY_URL: queryUrls.length - queryUrls.indexOf(queryUrl) + 1,
        });

        const branchUrls = await this.documentSelectorService.getAnchors(page);
        const filteredUrls = await this.handleFilter(branchUrls, input.url, input.subDirectory);

        this.logger.log({ filteredUrls });

        const validImageUrls = await this.handleBranchUrls(browser, input, filteredUrls);

        this.logger.log({ validImageUrls });

        imageUrls.push(...validImageUrls);
      } finally {
        await page.close();
      }
    }

    return imageUrls;
  }

  private async handleBranchUrls(browser: Browser, input: CreateImportQueueInput, formattedUrls: string[]) {
    const imageUrls: string[] = [];

    for (const anchor of formattedUrls) {
      try {
        this.logger.log({
          VISITING_BRANCH_URL: anchor,
          LEFT_BRANCH_URL: formattedUrls.length - formattedUrls.indexOf(anchor) + 1,
        });

        const urls = await this.importSingleBranch(browser, { ...input, url: anchor });
        imageUrls.push(...urls);
      } catch {
        this.logger.error({ '❌ Error processing anchor': anchor });
      }
    }

    return imageUrls;
  }

  private async importBranches(browser: Browser, input: CreateImportQueueInput) {
    const page = await browser.newPage();
    try {
      try {
        await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        await page.goto(input.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      const branchUrls = await this.documentSelectorService.getAnchors(page);
      const filteredUrls = await this.handleFilter(branchUrls, input.url, input.subDirectory);

      for (const anchor of filteredUrls) {
        try {
          await this.importSingleBranch(browser, { ...input, url: anchor });
        } catch {
          this.logger.error({ '❌ Error processing anchor': anchor });
        }
      }
    } finally {
      await page.close();
    }
  }
}
