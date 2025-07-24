import { Module } from '@nestjs/common';
import { MessageChannelsModule } from '../message-channels';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesService, MessagesResolver],
  imports: [MessageChannelsModule],
})
export class MessagesModule {}
