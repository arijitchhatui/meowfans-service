import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { MessageChannelsRepository } from '../rdb/repositories';
import { PaginationInput, UserRoles } from '../service.constants';
import { CreateChannelInput, GetChannelInput, UpdateChannelInput } from './dto';

@Injectable()
export class MessageChannelsService {
  public constructor(private readonly messageChannelsRepository: MessageChannelsRepository) {}

  public async getOrCreateChannel(input: CreateChannelInput) {
    const existingChannel = await this.messageChannelsRepository.getChannelByParticipants(input);
    if (existingChannel) return existingChannel;

    return await this.messageChannelsRepository.save({
      participants: [
        { userId: input.creatorId, role: UserRoles.CREATOR },
        { userId: input.fanId, role: UserRoles.FAN },
      ],
    });
  }

  //needs to be implemented
  public async updateChannel(creatorId: string, input: UpdateChannelInput) {
    const channel = await this.messageChannelsRepository.findOneOrFail({ where: { id: input.channelId } });

    return await this.messageChannelsRepository.save(Object.assign(channel, shake(input)));
  }

  public async getChannels(userId: string, input: PaginationInput) {
    return await this.messageChannelsRepository.getChannels(userId, input);
  }
  //
  public async getChannel(userId: string, input: GetChannelInput) {
    return await this.messageChannelsRepository.getChannel(userId, input);
  }
}
