import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueTypes } from '../../util/enums';
import { AwsS3Module } from '../aws';
import { UsersConsumerService } from './users.consumer.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersResolver, UsersConsumerService],
  exports: [UsersService],
  imports: [
    AwsS3Module,
    BullModule.registerQueue({
      name: QueueTypes.CREATOR_UPDATE_QUEUE,
      defaultJobOptions: {
        attempts: 2,
        backoff: 5000,
        stackTraceLimit: 1,
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
})
export class UsersModule {}
