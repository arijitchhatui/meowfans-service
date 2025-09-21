import { HasSubdirectoryForBranch } from '@app/validators';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueTypes } from '../../util/enums';
import { AwsS3Module } from '../aws';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { VaultsService } from '../vaults';
import { ImportConsumerService } from './import-consumer.service';
import { ImportResolver } from './import.resolver';
import { ImportService } from './import.service';
import { PlaywrightModule } from './playwright.module';

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
    PlaywrightModule,
    AwsS3Module,
  ],
  providers: [
    ImportService,
    ImportResolver,
    VaultsService,
    DocumentSelectorService,
    ImportConsumerService,
    HasSubdirectoryForBranch,
  ],
  exports: [ImportService],
})
export class ImportModule {}
