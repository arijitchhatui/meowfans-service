import { Module } from '@nestjs/common';
import { MessageChannelsResolver } from './message-channels.resolver';
import { MessageChannelsService } from './message-channels.service';

@Module({
  providers: [MessageChannelsResolver, MessageChannelsService],
  exports: [MessageChannelsService],
})
export class MessageChannelsModule {}
