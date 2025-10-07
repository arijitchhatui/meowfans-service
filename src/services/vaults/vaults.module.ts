import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueTypes } from '../../util/enums';
import { SSEService } from '../sse/sse.service';
import { VaultsConsumerService } from './vaults.consumer.service';
import { VaultsResolver } from './vaults.resolver';
import { VaultsService } from './vaults.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueTypes.UPDATE_PREVIEW_OF_VAULT,
      defaultJobOptions: {
        attempts: 2,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: true,
        stackTraceLimit: 1,
      },
    }),
  ],
  providers: [VaultsService, VaultsResolver, SSEService, VaultsConsumerService],
  exports: [VaultsService],
})
export class VaultsModule {}
