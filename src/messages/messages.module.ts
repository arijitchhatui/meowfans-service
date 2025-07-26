import { Module } from '@nestjs/common';
import { MessageChannelParticipantsModule } from '../message-channel-participants';
import { MessageChannelsModule } from '../message-channels';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesService, MessagesResolver],
  imports: [MessageChannelsModule, MessageChannelParticipantsModule],
})
export class MessagesModule {}
