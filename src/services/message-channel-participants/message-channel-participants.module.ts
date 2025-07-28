import { Module } from '@nestjs/common';
import { MessageChannelParticipantsResolver } from './message-channel-participants.resolver';
import { MessageChannelParticipantsService } from './message-channel-participants.service';

@Module({
  providers: [MessageChannelParticipantsResolver, MessageChannelParticipantsService],
  exports: [MessageChannelParticipantsService],
})
export class MessageChannelParticipantsModule {}
