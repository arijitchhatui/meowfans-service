import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { MessageChannelParticipantsRepository } from '../rdb/repositories';
import { UpdateMessageChannelParticipantInput } from './dto';

@Injectable()
export class MessageChannelParticipantsService {
  public constructor(private messageChannelParticipantsRepository: MessageChannelParticipantsRepository) {}

  public async update(input: UpdateMessageChannelParticipantInput) {
    const { messageChannelId, userId, ...params } = input;

    const participant = await this.messageChannelParticipantsRepository.findOneOrFail({
      where: { messageChannelId: messageChannelId, userId: userId },
    });

    await this.messageChannelParticipantsRepository.save(Object.assign(participant, shake(params)));
  }
}
