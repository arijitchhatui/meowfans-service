import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium } from '@playwright/test';
import { Queue } from 'bull';
import Redis from 'ioredis';
import { ProviderTokens, QueueTypes } from '../../util/enums';
import { ImportTypes } from '../../util/enums/import-types';
import { ImportService } from '../import';
import { UsersRepository } from '../postgres/repositories';
import { CreateImportQueueInput } from './dto/create-import.dto';

@Injectable()
export class ExtractorService {
  private logger = new Logger(ExtractorService.name);
  private isTerminated = false;

  public constructor(
    @InjectQueue(QueueTypes.UPLOAD_QUEUE)
    private uploadQueue: Queue<CreateImportQueueInput>,
    private usersRepository: UsersRepository,
    private configService: ConfigService,
    private importService: ImportService,
    @Inject(ProviderTokens.REDIS_TOKEN) private redis: Redis,
  ) {}

  public async initiate(input: CreateImportQueueInput): Promise<string> {
    const { url, fileType, totalContent, qualityType, subDirectory, importType, exclude, start } = input;
    const creator = await this.usersRepository.findOneOrFail({ where: { id: input.creatorId } });

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

    await this.uploadQueue.add(input);
    return 'Added job';
  }

  public async terminateAllJobs(userId: string) {
    const isAdmin = await this.usersRepository.isAdmin(userId);
    if (!isAdmin) return false;

    this.redis.flushall();
    this.redis.flushdb();

    if (this.isTerminated) this.isTerminated = false;
    else this.isTerminated = true;

    await this.importService.terminateAllJobs();
    this.logger.warn({ message: `All jobs terminated`, status: this.isTerminated });
    return true;
  }

  public async handleImport(input: CreateImportQueueInput) {
    this.isTerminated = false;
    this.importService.initiateAllJobs();

    const { importType } = input;
    const browser = await chromium.connect(this.configService.getOrThrow<string>('PLAYWRIGHT_DO_ACCESS_KEY'));

    this.logger.log({
      METHOD: this.handleImport.name,
      BROWSER_INITIATE_MESSAGE: 'Browser is initialized',
      BROWSER_VERSION: browser.version(),
      hasTerminated: this.isTerminated,
    });

    if (this.isTerminated) {
      this.logger.log({ message: '⚠️⚠️⚠️ TERMINATED EARLIER BEFORE EXECUTION HAS STARTED ⚠️⚠️⚠️ ' });
      return;
    }

    try {
      switch (importType) {
        case ImportTypes.PAGE:
          return await this.importService.importProfiles(browser, input);
        case ImportTypes.PROFILE:
          return await this.importService.importProfile(browser, input);
        case ImportTypes.BRANCH:
          return await this.importService.importBranch(browser, input);
        case ImportTypes.SINGLE:
          return await this.importService.importPage(browser, input);
        default:
          return;
      }
    } catch (error: unknown) {
      this.logger.error({ METHOD: this.handleImport.name, IMPORT_FAILED: error });
      throw error;
    } finally {
      this.logger.log({
        METHOD: this.handleImport.name,
        MESSAGE: this.isTerminated
          ? '🛑⚠️⚠️ TERMINATED IMPORT OPERATION, CHECK FOR LOGS ⚠️⚠️🛑'
          : '✅✅✅ IMPORT OPERATION EXECUTED SUCCESSFULLY ✅✅✅',
      });
      await browser.close();
      this.isTerminated = false;
    }
  }
}
