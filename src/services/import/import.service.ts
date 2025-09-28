import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { cluster } from 'radash';
import { AuthService } from '../auth';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { PasswordsRepository, UsersRepository, VaultsRepository } from '../postgres/repositories';
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
    private readonly vaultsRepository: VaultsRepository,
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
      await this.safeGoto(page, url, this.importProfiles.name);

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
      await this.safeGoto(page, url, this.importProfile.name);

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

      const imageUrls = await this.handleQueryUrls(
        browser,
        input.isNewCreator ? { ...input, creatorId: (await this.scanOrCreateNewProfile(url)).userId } : input,
        toBeImportedUrls,
      );

      this.logger.log({ METHOD: this.importProfile.name, imageUrls });
    } finally {
      await page.close();
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
      await this.safeGoto(page, input.url, this.importPage.name);

      this.logger.log({ METHOD: this.importBranch.name, VISITING_QUERY_URL: input.url });

      const branchUrls = await this.documentSelectorService.getAnchors(page);
      const filteredUrls = await this.handleFilter(branchUrls, input.url, input.subDirectory);

      this.logger.log({ METHOD: this.importBranch.name, filteredUrls });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return imageUrls;
      }

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

  public async importPage(browser: Browser, input: CreateImportQueueInput) {
    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return [];
    }

    const { url, qualityType } = input;
    const page = await browser.newPage();

    try {
      await this.safeGoto(page, url, this.importPage.name);

      this.logger.log({ METHOD: this.importPage.name, VISITING_SINGLE_BRANCH_URL: url });

      const urls = await this.documentSelectorService.getContentUrls(page, qualityType);
      const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

      this.logger.log({ METHOD: this.importPage.name, FILTERED_IMAGES_COUNT: filteredUrls.length });

      if (filteredUrls.length > 0 && !this.isTerminated) {
        await this.handleUploadToVault(input.creatorId, input.url, filteredUrls);
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
      return;
    }

    for (const chunk of cluster(Array.from(new Set(queryUrls)), 3)) {
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

  private async handleUploadToVault(creatorId: string, baseUrl: string, filteredUrls: string[]) {
    await this.vaultsRepository.bulkInsert(creatorId, { objects: filteredUrls, baseUrl: baseUrl });
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
