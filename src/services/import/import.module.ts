import { HasSubdirectoryForBranch } from '@app/validators';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nestjs-pptr';
import { AssetsService } from '../assets';
import { AwsS3Module } from '../aws';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { DownloaderService } from '../downloader/downloader.service';
import { ImportConsumerService } from './import-consumer.service';
import { ImportResolver } from './import.resolver';
import { ImportService } from './import.service';
import { QueueTypes } from '../../util/enums';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueTypes.UPLOAD_QUEUE,
      defaultJobOptions: {
        attempts: 2,
        backoff: 5000,
        timeout: 15000,
        removeOnComplete: true,
        removeOnFail: true,
        stackTraceLimit: 1,
      },
    }),
    PuppeteerModule.forRootAsync({
      useFactory: () => ({
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      }),
    }),
    AwsS3Module,
  ],
  providers: [
    ImportService,
    ImportResolver,
    AssetsService,
    DownloaderService,
    DocumentSelectorService,
    ImportConsumerService,
    HasSubdirectoryForBranch,
  ],
})
export class ImportModule {}
