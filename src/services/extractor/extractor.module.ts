import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueTypes } from '../../util/enums';
import { ExtractorConsumerService } from './extractor-consumer.service';
import { ExtractorResolver } from './extractor.resolver';
import { ExtractorService } from './extractor.service';

@Module({
  providers: [ExtractorService, ExtractorResolver, ExtractorConsumerService],
  imports: [
    BullModule.registerQueue({
      name: QueueTypes.UPLOAD_QUEUE,
      defaultJobOptions: {
        attempts: 2,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: true,
        stackTraceLimit: 1,
      },
    }),
  ],
  exports: [],
})
export class ExtractorModule {}
