import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueTypes } from '../../util/enums';
import { AssetsService } from '../assets';
import { AwsS3Module } from '../aws';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { DownloaderConsumerService } from './downloader.consumer.service';
import { DownloaderResolver } from './downloader.resolver';
import { DownloaderService } from './downloader.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueTypes.UPLOAD_VAULT_QUEUE,
      defaultJobOptions: {
        attempts: 2,
        backoff: 5000,
        stackTraceLimit: 1,
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    AwsS3Module,
  ],
  providers: [DownloaderService, DocumentSelectorService, AssetsService, DownloaderResolver, DownloaderConsumerService],
  exports: [DownloaderService],
})
export class DownloaderModule {}
