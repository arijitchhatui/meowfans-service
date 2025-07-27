import { Module } from '@nestjs/common';
import { HasAssetsForExclusivePropValidator } from '../lib/validators/has-assets-for-exclusive.validator';
import { MessageChannelParticipantsModule } from '../message-channel-participants';
import { MessageChannelsModule } from '../message-channels';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesService, MessagesResolver, HasAssetsForExclusivePropValidator],
  imports: [MessageChannelsModule, MessageChannelParticipantsModule],
})
export class MessagesModule {}
