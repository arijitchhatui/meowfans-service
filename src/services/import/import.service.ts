import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, chromium } from '@playwright/test';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { QueueTypes, UserRoles } from '../../util/enums';
import { ImportTypes } from '../../util/enums/import-types';
import { AuthService } from '../auth';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { PasswordsRepository, UsersRepository, VaultsRepository } from '../postgres/repositories';
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
    private authservice: AuthService,
    private passwordsRepository: PasswordsRepository,
    private vaultsRepository: VaultsRepository,
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
          return await this.importBranch(browser, input);
        case ImportTypes.SINGLE:
          return await this.importPage(browser, input);
        case ImportTypes.PAGE:
          return await this.importProfiles(browser, input);
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

  public async importProfiles(browser: Browser, input: CreateImportQueueInput) {
    const isAdmin = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.roles && :roles', { roles: [UserRoles.ADMIN] })
      .getOne();
    if (!isAdmin) return;

    const { url, start, exclude } = input;

    const page = await browser.newPage();
    this.logger.log({
      METHOD: this.importProfiles.name,
      MESSAGE: 'STARTED IMPORTING PROFILES',
      url,
    });

    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn({
          METHOD: this.importProfiles.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_TO_DOM_CONTENT_LOADED_FOR_URL: input.url,
        });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      const anchorUrls = await this.documentSelectorService.getAnchors(page);
      const regex = /^https:\/\/coomer\.st\/[^/]+\/user\/[^/]+$/;

      const allQueryUrls = anchorUrls.filter((url) => regex.test(url));

      const queryUrls = Array.from(new Set(allQueryUrls));
      this.logger.log({
        METHOD: this.importProfiles.name,
        queryUrls,
      });

      const slicedUrls = queryUrls.slice(start, queryUrls.length - exclude);
      this.logger.log({
        METHOD: this.importProfile.name,
        slicedUrls,
      });

      await this.handleImportProfile(browser, input, slicedUrls);
    } finally {
      await page.close();
    }
  }

  public async handleImportProfile(browser: Browser, input: CreateImportQueueInput, profileUrls: string[]) {
    for (const profileUrl of Array.from(new Set(profileUrls))) {
      this.logger.log({
        METHOD: this.handleImportProfile.name,
        VISITING_PROFILE_URL: profileUrl,
      });

      const username = profileUrl.split('/').filter(Boolean).at(-1);
      const email = username?.concat(this.configService.getOrThrow<string>('CREATOR_DOMAIN'));
      const fullName = username?.toUpperCase();
      const password = randomUUID();

      this.logger.log({
        username,
        email,
        fullName,
        password,
      });

      const user = await this.usersRepository.exists({ where: { username: username } });

      if (!user && username && email && fullName) {
        this.logger.log({
          METHOD: this.handleImportProfile.name,
          MESSAGE: 'CREATING NEW USER',
        });

        const newCreator = await this.authservice.creatorSignup({ email, fullName, password, username });
        await this.passwordsRepository.save({ userId: newCreator.userId, email: email, password: password });

        this.logger.log({
          METHOD: this.handleImportProfile.name,
          NEW_CREATOR_EMAIL: email,
          MESSAGE: '✅✅✅✅ NEW PROFILE CREATED ✅✅✅✅',
          CREATED_NEW_CREATOR: newCreator.userId,
        });

        await this.importProfile(browser, {
          ...input,
          creatorId: newCreator.userId,
          subDirectory: username,
          url: profileUrl,
        });

        this.logger.log({
          METHOD: this.handleImportProfile.name,
          MESSAGE: '✅✅✅✅ ALL ASSETS IMPORTED',
          TO: username,
        });
      }
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
        this.logger.warn({
          METHOD: this.importProfile.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_TO_DOM_CONTENT_LOADED_FOR_URL: input.url,
        });
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

  private async importBranch(browser: Browser, input: CreateImportQueueInput) {
    const imageUrls: string[] = [];

    const page = await browser.newPage();
    try {
      try {
        await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn({
          METHOD: this.importBranch.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_TO_DOM_CONTENT_LOADED_FOR_URL: input.url,
        });
        await page.goto(input.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      this.logger.log({
        METHOD: this.importBranch.name,
        VISITING_QUERY_URL: input.url,
      });

      const branchUrls = await this.documentSelectorService.getAnchors(page);
      const filteredUrls = await this.handleFilter(branchUrls, input.url, input.subDirectory);
      this.logger.log({
        METHOD: this.importBranch.name,
        filteredUrls,
      });

      const validImageUrls = await this.handleBranchUrls(browser, input, filteredUrls);
      this.logger.log({
        METHOD: this.importBranch.name,
        validImageUrls,
      });

      imageUrls.push(...validImageUrls);
    } finally {
      await page.close();
    }
    return imageUrls;
  }

  private async importPage(browser: Browser, input: CreateImportQueueInput) {
    const { url, qualityType } = input;

    const page = await browser.newPage();
    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn({
          METHOD: this.importPage.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_TO_DOM_CONTENT_LOADED_FOR_URL: url,
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      this.logger.log({
        METHOD: this.importPage.name,
        VISITING_SINGLE_BRANCH_URL: url,
      });

      const urls = await this.documentSelectorService.getContentUrls(page, qualityType);
      const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

      this.logger.log({
        METHOD: this.importPage.name,
        FILTERED_IMAGES_COUNT: filteredUrls.length,
      });
      await this.handleUploadToVault(input.creatorId, url, filteredUrls);

      return filteredUrls;
    } finally {
      await page.close();
    }
  }

  private async handleQueryUrls(browser: Browser, input: CreateImportQueueInput, queryUrls: string[]) {
    const imageUrls: string[] = [];

    for (const queryUrl of queryUrls) {
      const imageUrls = await this.importBranch(browser, { ...input, url: queryUrl });
      imageUrls.push(...imageUrls);
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

        const urls = await this.importPage(browser, { ...input, url: anchor });
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
    await this.vaultsRepository.bulkInsert(creatorId, { objects: filteredUrls, baseUrl: baseUrl });
  }

  private async handleFilter(branchUrls: string[], url: string, subDirectory?: string): Promise<string[]> {
    const filteredUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(branchUrls, url, subDirectory);
    return Array.from(new Set(filteredUrls));
  }
}
