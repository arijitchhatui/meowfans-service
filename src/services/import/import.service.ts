import { profanity } from '@2toad/profanity';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { cluster } from 'radash';
import { OK_URI } from '../../util/constants';
import { ContentType, DocumentQualityType } from '../../util/enums';
import { ImportTypes } from '../../util/enums/import-types';
import { ServiceType } from '../../util/enums/service-type';
import { AuthService } from '../auth';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { PasswordsRepository, UsersRepository } from '../postgres/repositories';
import { VaultsService } from '../vaults';
import { CreateImportQueueInput } from './dto';

@Injectable()
export class ImportService {
  private logger = new Logger(ImportService.name);
  private isTerminated = false;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly documentSelectorService: DocumentSelectorService,
    private readonly configService: ConfigService,
    private readonly authservice: AuthService,
    private readonly passwordsRepository: PasswordsRepository,
    private readonly vaultsService: VaultsService,
  ) {}

  public terminateAllJobs() {
    this.isTerminated = true;
  }

  public initiateAllJobs() {
    this.isTerminated = false;
  }

  private async scanOrCreateNewProfile(profileUrl: string): Promise<{ userId: string; username: string }> {
    const username = profileUrl.split('/').filter(Boolean).at(-1);
    const email = username?.concat(this.configService.getOrThrow<string>('CREATOR_DOMAIN'));
    const fullName = username?.toUpperCase();
    const password = randomUUID();

    const user = await this.usersRepository.findOne({ where: { username } });

    if (username && email && fullName && !user) {
      const newCreator = await this.authservice.creatorSignup({ email, fullName, password, username });
      await this.passwordsRepository.save({ userId: newCreator.userId, email, password });

      this.logger.log({
        METHOD: this.scanOrCreateNewProfile.name,
        MESSAGE: '✅✅✅✅ NEW PROFILE CREATED ✅✅✅✅',
        CREATED_NEW_CREATOR: newCreator.userId,
        username,
        email,
        fullName,
        password,
      });

      return { userId: newCreator.userId, username: username };
    }

    this.logger.log({
      METHOD: this.scanOrCreateNewProfile.name,
      MESSAGE: 'IMPORTING INTO EXISTING USER',
    });

    return { userId: user!.id, username: user!.username };
  }

  public async importProfiles(browser: Browser, input: CreateImportQueueInput) {
    const isAdmin = await this.usersRepository.isAdmin(input.creatorId);
    if (!isAdmin) return;

    const { url, start, exclude } = input;

    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return;
    }

    const page = await browser.newPage();
    this.logger.log({
      METHOD: this.importProfiles.name,
      MESSAGE: 'STARTED IMPORTING PROFILES',
      url,
    });

    try {
      try {
        await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        try {
          await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
          this.logger.warn({ METHOD: this.importBranch.name, NAVIGATION_TIMEOUT: input.url });
        } catch {
          await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
        }
      }

      const anchorUrls = await this.documentSelectorService.getAnchors(page);
      const regex = /^https:\/\/coomer\.st\/[^/]+\/user\/[^/]+$/;
      const allQueryUrls = anchorUrls.filter((url) => regex.test(url));

      const queryUrls = Array.from(new Set(allQueryUrls));
      const slicedUrls = queryUrls.slice(start, queryUrls.length - exclude);

      this.logger.log({ METHOD: this.importProfiles.name, allQueryUrls, queryUrls, slicedUrls });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return;
      }

      await this.handleImportProfiles(browser, { ...input, start: 0, exclude: 0 }, slicedUrls);
    } finally {
      await page.close();
    }
  }

  public async handleImportProfiles(browser: Browser, input: CreateImportQueueInput, profileUrls: string[]) {
    for (const chunk of cluster(Array.from(new Set(profileUrls)), 2)) {
      if (this.isTerminated) return;
      await Promise.all(
        chunk.map(async (profileUrl) => {
          await this.handleImportProfile(browser, { ...input, url: profileUrl });
        }),
      );
    }
  }

  public async handleImportProfile(browser: Browser, input: CreateImportQueueInput) {
    if (this.isTerminated) return;

    const user_name = input.url.split('/').filter(Boolean).at(-1);
    if (user_name && !input.exceptions.includes(user_name)) {
      const { userId, username } = await this.scanOrCreateNewProfile(input.url);

      await this.importProfile(browser, {
        ...input,
        creatorId: userId,
        subDirectory: username,
        url: input.url,
      });

      this.logger.log({
        METHOD: this.handleImportProfiles.name,
        MESSAGE: '✅✅✅✅ ALL ASSETS IMPORTED',
        TO: username,
      });
    }
  }
  public async importProfile(browser: Browser, input: CreateImportQueueInput) {
    const { url, subDirectory, start, exclude } = input;

    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return;
    }

    const page = await browser.newPage();
    this.logger.log({ METHOD: this.importProfile.name, MESSAGE: 'STARTED IMPORTING PROFILE', input });

    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          this.logger.warn({ METHOD: this.importBranch.name, NAVIGATION_TIMEOUT: url });
        } catch {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        }
      }

      const anchorUrls = await this.documentSelectorService.getAnchors(page);
      const allQueryUrls = anchorUrls.filter((url) => url.includes(`/user/${subDirectory}?o=`));
      const queryUrls = Array.from(new Set(allQueryUrls));

      this.logger.log({ METHOD: this.importProfile.name, anchorUrls, allQueryUrls, queryUrls });

      const numbers = queryUrls
        .map((url) => Number(new URL(url).searchParams.get('o')))
        .filter((num) => Number(num) > 0);

      let formattedUrls: string[] = [];
      if (numbers.length > 0) {
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const pagesCount = Math.max(0, Math.floor((max - min) / 50)) + 1;
        formattedUrls = Array.from({ length: pagesCount }, (_, i) => `${url}?o=${min + i * 50}`);
      } else {
        formattedUrls = [];
      }
      const implementedUrls = [url, ...formattedUrls];
      const toBeImportedUrls = implementedUrls.slice(start, implementedUrls.length - exclude);

      this.logger.log({ METHOD: this.importProfile.name, implementedUrls });
      this.logger.log({ toBeImportedUrls });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return;
      }
      const newInput = input.isNewCreator
        ? { ...input, creatorId: (await this.scanOrCreateNewProfile(url)).userId }
        : input;

      const postUrls = await this.handleQueryUrls(browser, newInput, toBeImportedUrls);

      await this.handleImportPages(browser, newInput, postUrls);

      this.logger.log({ METHOD: this.importProfile.name, postUrls });
    } finally {
      await page.close();
    }
  }

  public async handleImportPages(browser: Browser, input: CreateImportQueueInput, postUrls: string[]) {
    for (const chunk of cluster(Array.from(new Set(postUrls)), 3)) {
      await Promise.all(
        chunk.map(async (postUrl) => {
          await this.importPage(browser, { ...input, url: postUrl });
        }),
      );
    }
  }

  public async importBranch(browser: Browser, input: CreateImportQueueInput) {
    const imageUrls: string[] = [];

    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return [];
    }

    const page = await browser.newPage();
    try {
      try {
        await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        try {
          await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
          this.logger.warn({ METHOD: this.importBranch.name, NAVIGATION_TIMEOUT: input.url });
        } catch {
          await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
        }
      }

      this.logger.log({ METHOD: this.importBranch.name, VISITING_QUERY_URL: input.url });

      const branchUrls = await this.documentSelectorService.getAnchors(page);
      const filteredUrls = await this.handleFilter(branchUrls, input.url, input.subDirectory);

      this.logger.log({ METHOD: this.importBranch.name, filteredUrls });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return imageUrls;
      }

      // const validImageUrls = await this.handleBranchUrls(browser, input, filteredUrls);
      // this.logger.log({
      //   METHOD: this.importBranch.name,
      //   validImageUrls,
      // });

      imageUrls.push(...filteredUrls);
    } finally {
      await page.close();
    }
    return imageUrls;
  }

  public async importPage(browser: Browser, input: CreateImportQueueInput) {
    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return [];
    }

    const { url, qualityType, creatorId, importType } = input;
    const page = await browser.newPage();

    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          this.logger.warn({ METHOD: this.importPage.name, NAVIGATION_TIMEOUT: url });
        } catch {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        }
      }

      this.logger.log({ METHOD: this.importPage.name, VISITING_SINGLE_BRANCH_URL: url });

      const urls = await this.documentSelectorService.getContentUrls(page, qualityType);
      const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

      this.logger.log({ METHOD: this.importPage.name, urls, filteredUrls, FILTERED_IMAGES_COUNT: filteredUrls.length });

      if (filteredUrls.length > 0 && !this.isTerminated) {
        await this.handleUploadToVault(creatorId, input.url, filteredUrls, ContentType.SFW, importType);
      }

      return filteredUrls;
    } finally {
      await page.close();
    }
  }

  public async importOKPage(browser: Browser, input: CreateImportQueueInput) {
    const { start, exclude, serviceType } = input;
    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return [];
    }
    const span = exclude;

    this.logger.log({ METHOD: this.importOKPage.name, ...input, span });

    const okUrls = Array.from({ length: span }, (_, i) => `${OK_URI}${start + i + 5}/`);

    this.logger.log({ okUrls });

    for (const chunk of cluster(Array.from(new Set(okUrls)), serviceType.includes(ServiceType.DOS) ? 5 : 7)) {
      if (this.isTerminated) return;
      await Promise.all(
        chunk.map(async (okUrl) => {
          await this.handleImportOKPage(browser, { ...input, url: okUrl });
        }),
      );
    }
  }

  private async handleImportOKPage(browser: Browser, input: CreateImportQueueInput) {
    const { url, importType } = input;
    const page = await browser.newPage();

    if (this.isTerminated) return;

    try {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      } catch {
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          this.logger.warn({ METHOD: this.handleImportOKPage.name, NAVIGATION_TIMEOUT: url });
        } catch {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        }
      }

      const title = await page.title();

      const handles = title
        .split(' ')
        .filter(Boolean)
        .map((t) => t.replace(/[^A-Za-z]/g, '').toLowerCase())
        .slice(0, 2);

      const userName = handles.some((handle) => profanity.exists(handle)) ? handles[0] : handles.join('');
      const profileUrl = OK_URI.concat(userName);

      this.logger.log({
        METHOD: this.handleImportOKPage.name,
        VISITING_SINGLE_BRANCH_URL: url,
        title,
        handles,
        userName,
        profileUrl,
      });

      const urls = await this.documentSelectorService.getContentUrls(page, DocumentQualityType.DIV_DEFINITION);
      const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

      this.logger.log({
        METHOD: this.handleImportOKPage.name,
        urls,
        filteredUrls,
        FILTERED_IMAGES_COUNT: filteredUrls.length,
      });

      if (filteredUrls.length > 1 && !this.isTerminated) {
        const { userId } = await this.scanOrCreateNewProfile(profileUrl);
        await this.handleUploadToVault(userId, url, filteredUrls, ContentType.NSFW, importType);
      }

      return filteredUrls;
    } finally {
      await page.close();
    }
  }

  private async handleQueryUrls(browser: Browser, input: CreateImportQueueInput, queryUrls: string[]) {
    const imageUrls: string[] = [];

    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return imageUrls;
    }

    for (const chunk of cluster(Array.from(new Set(queryUrls)), input.serviceType.includes(ServiceType.RAS) ? 5 : 3)) {
      if (!this.isTerminated) {
        await Promise.all(
          chunk.map(async (queryUrl) => {
            const branchImageUrls = await this.handleQueryUrl(browser, { ...input, url: queryUrl });
            imageUrls.push(...branchImageUrls);
          }),
        );
      }
    }

    return imageUrls;
  }

  private async handleQueryUrl(browser: Browser, input: CreateImportQueueInput) {
    const imageUrls: string[] = [];
    if (this.isTerminated) return imageUrls;

    const branchUrls = await this.importBranch(browser, input);
    imageUrls.push(...branchUrls);

    return imageUrls;
  }

  private async handleBranchUrls(browser: Browser, input: CreateImportQueueInput, formattedUrls: string[]) {
    const imageUrls: string[] = [];

    for (const chunk of cluster(formattedUrls, 5)) {
      if (!this.isTerminated) {
        await Promise.all(
          chunk.map(async (anchor) => {
            const branchUrls = await this.handleBranchUrl(browser, { ...input, url: anchor });
            imageUrls.push(...branchUrls);
          }),
        );
      }
    }

    return imageUrls;
  }

  private async handleBranchUrl(browser: Browser, input: CreateImportQueueInput) {
    const imageUrls: string[] = [];
    if (!this.isTerminated) {
      try {
        this.logger.log({ METHOD: this.handleBranchUrl.name, VISITING_BRANCH_URL: input.url });

        const pageUrls = await this.importPage(browser, { ...input, url: input.url });
        imageUrls.push(...pageUrls);
      } catch {
        this.logger.error({ METHOD: this.handleBranchUrl.name, ERROR_WHILE_PROCESSING: input.url });
      }
    }
    return imageUrls;
  }

  private async handleUploadToVault(
    creatorId: string,
    baseUrl: string,
    filteredUrls: string[],
    contentType: ContentType,
    importType: ImportTypes,
  ) {
    await this.vaultsService.bulkInsert(creatorId, {
      objects: filteredUrls,
      baseUrl: baseUrl,
      contentType,
      importType,
    });
  }

  private async handleFilter(branchUrls: string[], url: string, subDirectory?: string): Promise<string[]> {
    const filteredUrls = await this.documentSelectorService.getAnchorsBasedOnHostName(branchUrls, url, subDirectory);
    return Array.from(new Set(filteredUrls));
  }

  private async safeGoto(page: Page, url: string, method: string) {
    const attempts = [30000, 30000, 45000];
    for (const timeout of attempts) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout });
        return;
      } catch {
        this.logger.warn({ METHOD: method, NAVIGATION_TIMEOUT: url, TIMEOUT: timeout });
      }
    }
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  }
}
