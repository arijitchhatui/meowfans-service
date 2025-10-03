import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueTypes } from '../../util/enums';
import { CreatorProfilesModule } from '../creator-profiles';
import { DownloaderModule } from '../downloader/downloader.module';
import { ExtractorModule } from '../extractor/extractor.module';
import { AdminConsumerService } from './admin.consumer.service';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  providers: [AdminResolver, AdminService, AdminConsumerService],
  imports: [
    DownloaderModule,
    ExtractorModule,
    CreatorProfilesModule,
    BullModule.registerQueue({
      name: QueueTypes.BATCH_UPLOAD_VAULT_QUEUE,
      defaultJobOptions: {
        attempts: 2,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: true,
        stackTraceLimit: 1,
      },
    }),
  ],
  exports: [AdminService],
})
export class AdminModule {}
