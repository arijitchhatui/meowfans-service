import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, chromium } from '@playwright/test';
import { Queue } from 'bull';
import { QueueTypes } from '../../util/enums';
import { ImportTypes } from '../../util/enums/import-types';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { UsersRepository } from '../postgres/repositories';
import { VaultsService } from '../vaults';
import { CreateImportInput, CreateImportQueueInput } from './dto/create-import.dto';

@Injectable()
export class ImportService {
  private logger = new Logger(ImportService.name);

  constructor(
    @InjectQueue(QueueTypes.UPLOAD_QUEUE)
    private uploadQueue: Queue<CreateImportQueueInput>,
    private usersRepository: UsersRepository,
    private documentSelectorService: DocumentSelectorService,
    private configService: ConfigService,
    private vaultsService: VaultsService,
  ) {}

  public async initiate(creatorId: string, input: CreateImportInput): Promise<string> {
    const { url, fileType, totalContent, qualityType, subDirectory, importType, exclude, start } = input;
    const creator = await this.usersRepository.findOneOrFail({ where: { id: creatorId } });

    this.logger.log({
      message: 'Importing started',
      url,
      creatorId: creator.id,
      fileType,
      totalContent,
      qualityType,
      subDirectory,
      importType,
      exclude,
      start,
    });

    await this.uploadQueue.add({ creatorId, ...input });
    return 'Added job';
  }

  public async handleImport(input: CreateImportQueueInput) {
    const { importType } = input;
    const browser = await chromium.connect(this.configService.getOrThrow<string>('PLAYWRIGHT_DO_ACCESS_KEY'));

    this.logger.log({
      METHOD: this.handleImport.name,
      BROWSER_INITIATE_MESSAGE: 'Browser is initialized',
      BROWSER_VERSION: browser.version(),
    });

    try {
      switch (importType) {
        case ImportTypes.PROFILE:
          return await this.importProfile(browser, input);
        case ImportTypes.BRANCH:
          return await this.importBranches(browser, input);
        case ImportTypes.SINGLE:
          return await this.importSingleBranch(browser, input);
        default:
          return;
      }
    } catch (error: unknown) {
      this.logger.error({ METHOD: this.handleImport.name, IMPORT_FAILED: error });
      throw error;
    } finally {
      this.logger.log({ METHOD: this.handleImport.name, MESSAGE: 'DONE' });
      await browser.close();
    }
  }

  public async importProfile(browser: Browser, input: CreateImportQueueInput) {
    const { url, subDirectory, start, exclude } = input;

    const page = await browser.newPage();
    this.logger.log({
      METHOD: this.importProfile.name,
      MESSAGE: 'STARTED IMPORTING PROFILE',
      url,
    });

    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      const anchorUrls = await this.documentSelectorService.getAnchors(page);
      const allQueryUrls = anchorUrls.filter((url) => url.includes(`/user/${subDirectory}?o=`));

      const queryUrls = Array.from(new Set(allQueryUrls)).slice(1);
      this.logger.log({
        METHOD: this.importProfile.name,
        queryUrls,
      });

      const slicedUrls = queryUrls.slice(start, queryUrls.length - exclude);
      this.logger.log({
        METHOD: this.importProfile.name,
        slicedUrls,
      });

      const imageUrls = await this.handleQueryUrls(browser, input, slicedUrls);
      this.logger.log({
        METHOD: this.importProfile.name,
        imageUrls,
      });
    } finally {
      await page.close();
    }
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

  private async importSingleBranch(browser: Browser, input: CreateImportQueueInput) {
    const { url, qualityType } = input;

    const page = await browser.newPage();
    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn({
          METHOD: this.importSingleBranch.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_TO_DOM_CONTENT_LOADED_FOR_URL: url,
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      this.logger.log({
        METHOD: this.importSingleBranch.name,
        VISITING_SINGLE_BRANCH_URL: url,
      });

      const urls = await this.documentSelectorService.getContentUrls(page, qualityType);
      const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

      this.logger.log({
        METHOD: this.importSingleBranch.name,
        FILTERED_IMAGES_COUNT: filteredUrls.length,
      });

      return filteredUrls;
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
          METHOD: this.handleQueryUrls.name,
          VISITING_QUERY_URL: queryUrl,
          LEFT_QUERY_URL: queryUrls.length - queryUrls.indexOf(queryUrl),
        });

        const branchUrls = await this.documentSelectorService.getAnchors(page);
        const filteredUrls = await this.handleFilter(branchUrls, input.url, input.subDirectory);
        this.logger.log({
          METHOD: this.handleQueryUrls.name,
          filteredUrls,
        });

        const validImageUrls = await this.handleBranchUrls(browser, input, filteredUrls);
        this.logger.log({
          METHOD: this.handleQueryUrls.name,
          validImageUrls,
        });

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
          METHOD: this.handleBranchUrls.name,
          VISITING_BRANCH_URL: anchor,
          LEFT_BRANCH_URL: formattedUrls.length - formattedUrls.indexOf(anchor) + 1,
        });

        const urls = await this.importSingleBranch(browser, { ...input, url: anchor });
        await this.handleUploadToVault(input.creatorId, anchor, urls);
        imageUrls.push(...urls);
      } catch {
        this.logger.error({
          METHOD: this.handleBranchUrls.name,
          ERROR_WHILE_PROCESSING: anchor,
        });
      }
    }

    return imageUrls;
  }

  private async handleUploadToVault(creatorId: string, baseUrl: string, filteredUrls: string[]) {
    await this.vaultsService.bulkInsert(creatorId, { objects: filteredUrls, baseUrl: baseUrl });
  }

  private async handleFilter(branchUrls: string[], url: string, subDirectory?: string): Promise<string[]> {
    const filteredUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(branchUrls, url, subDirectory);
    return Array.from(new Set(filteredUrls));
  }
}
