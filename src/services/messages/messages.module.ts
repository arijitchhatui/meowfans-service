import { Module } from '@nestjs/common';
import { MessageChannelParticipantsModule } from '../message-channel-participants';
import { MessageChannelsModule } from '../message-channels';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { HasAssetsForExclusivePropValidator } from '@app/validators';

@Module({
  providers: [MessagesService, MessagesResolver, HasAssetsForExclusivePropValidator],
  imports: [MessageChannelsModule, MessageChannelParticipantsModule],
  exports: [MessagesService],
})
export class MessagesModule {}
