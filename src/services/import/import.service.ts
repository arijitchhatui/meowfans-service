import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser } from '@playwright/test';
import { randomUUID } from 'crypto';
import { AuthService } from '../auth';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { PasswordsRepository, UsersRepository, VaultsRepository } from '../postgres/repositories';
import { CreateImportQueueInput } from './dto';

@Injectable()
export class ImportService {
  private logger = new Logger(ImportService.name);
  private isTerminated = false;

  constructor(
    private usersRepository: UsersRepository,
    private documentSelectorService: DocumentSelectorService,
    private configService: ConfigService,
    private authservice: AuthService,
    private passwordsRepository: PasswordsRepository,
    private vaultsRepository: VaultsRepository,
  ) {}

  public async terminateAllJobs() {
    if (this.isTerminated) this.isTerminated = true;
    else this.isTerminated = false;
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
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn({
          METHOD: this.importProfiles.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_AGAIN_TO_NETWORK_IDLE_FOR_URL: input.url,
        });
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        } catch {
          this.logger.warn({
            METHOD: this.importProfiles.name,
            NAVIGATION_TIMEOUT_FALLING_BACK_AGAIN_TO_NETWORK_IDLE_FOR_URL: input.url,
          });
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        }
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

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return;
      }

      await this.handleImportProfile(browser, { ...input, start: 0, exclude: 0 }, slicedUrls);
    } finally {
      await page.close();
    }
  }

  public async handleImportProfile(browser: Browser, input: CreateImportQueueInput, profileUrls: string[]) {
    const { exceptions } = input;

    for (const profileUrl of Array.from(new Set(profileUrls))) {
      this.logger.log({
        METHOD: this.handleImportProfile.name,
        VISITING_PROFILE_URL: profileUrl,
        hasTerminated: this.isTerminated,
      });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        break;
      }

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

      if (username && email && fullName && !exceptions.includes(username)) {
        const user = await this.usersRepository.findOne({ where: { username: username } });

        if (user) {
          this.logger.log({
            METHOD: this.handleImportProfile.name,
            MESSAGE: 'IMPORTING INTO EXISTING USER',
          });

          if (this.isTerminated) {
            this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
            return;
          }

          await this.importProfile(browser, {
            ...input,
            creatorId: user.id,
            subDirectory: user.username,
            url: profileUrl,
          });
        } else {
          this.logger.log({
            METHOD: this.handleImportProfile.name,
            MESSAGE: 'CREATING NEW USER',
          });

          if (this.isTerminated) {
            this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
            return;
          }

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
        }

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

    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return;
    }

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
          NAVIGATION_TIMEOUT_FALLING_BACK_AGAIN_TO_NETWORK_IDLE_FOR_URL: input.url,
        });
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        } catch {
          try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          } catch {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          }
        }
      }

      const anchorUrls = await this.documentSelectorService.getAnchors(page);
      const allQueryUrls = anchorUrls.filter((url) => url.includes(`/user/${subDirectory}?o=`));

      const queryUrls = Array.from(new Set(allQueryUrls));
      this.logger.log({
        METHOD: this.importProfile.name,
        queryUrls,
      });

      const numbers = queryUrls
        .map((url) => Number(new URL(url).searchParams.get('o')))
        .filter((num) => Number(num) > 0);

      const min = Math.min(...numbers);
      const max = Math.max(...numbers);

      const formattedUrls = Array.from({ length: (max - min) / 50 + 1 }, (_, i) => `${url}?o=${min + i * 50}`);
      const implementedUrls = [url, ...formattedUrls];

      this.logger.log({
        METHOD: this.importProfile.name,
        implementedUrls,
      });

      const toBeImportedUrls = implementedUrls.slice(start, implementedUrls.length - exclude);

      this.logger.log({ toBeImportedUrls });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return;
      }

      const imageUrls = await this.handleQueryUrls(browser, input, toBeImportedUrls);

      this.logger.log({
        METHOD: this.importProfile.name,
        imageUrls,
      });
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
      try {
        await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn({
          METHOD: this.importBranch.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_AGAIN_TO_NETWORK_IDLE_FOR_URL: input.url,
        });
        try {
          await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
        } catch {
          await page.goto(input.url, { waitUntil: 'networkidle', timeout: 30000 });
        }
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

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return [];
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
    const { url, qualityType } = input;

    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return [];
    }

    const page = await browser.newPage();
    try {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        this.logger.warn({
          METHOD: this.importPage.name,
          NAVIGATION_TIMEOUT_FALLING_BACK_AGAIN_TO_NETWORK_IDLE_FOR_URL: url,
        });
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        } catch {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        }
      }

      this.logger.log({
        METHOD: this.importPage.name,
        VISITING_SINGLE_BRANCH_URL: url,
      });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return [];
      }

      const urls = await this.documentSelectorService.getContentUrls(page, qualityType);
      const filteredUrls = this.documentSelectorService.filterByExtension(urls, url);

      this.logger.log({
        METHOD: this.importPage.name,
        FILTERED_IMAGES_COUNT: filteredUrls.length,
      });

      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        return [];
      }
      await this.handleUploadToVault(input.creatorId, url, filteredUrls);

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

    for (const queryUrl of Array.from(new Set(queryUrls))) {
      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        break;
      }

      const branchImageUrls = await this.importBranch(browser, { ...input, url: queryUrl });
      imageUrls.push(...branchImageUrls);
    }

    return imageUrls;
  }

  private async handleBranchUrls(browser: Browser, input: CreateImportQueueInput, formattedUrls: string[]) {
    const imageUrls: string[] = [];

    this.logger.log({ status: this.isTerminated });
    if (this.isTerminated) {
      this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
      return [];
    }

    for (const anchor of formattedUrls) {
      if (this.isTerminated) {
        this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
        break;
      }

      this.logger.log({ status: this.isTerminated });

      try {
        this.logger.log({
          METHOD: this.handleBranchUrls.name,
          VISITING_BRANCH_URL: anchor,
          LEFT_BRANCH_URL: formattedUrls.length - formattedUrls.indexOf(anchor) + 1,
        });

        if (this.isTerminated) {
          this.logger.log({ message: 'TERMINATED FORCEFULLY', status: this.isTerminated });
          break;
        }

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
