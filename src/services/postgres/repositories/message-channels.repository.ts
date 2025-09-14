import { PaginationInput } from '@app/helpers';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { GetChannelInput } from '../../message-channels/dto';
import { MessageChannelsEntity } from '../entities';

@Injectable()
export class MessageChannelsRepository extends Repository<MessageChannelsEntity> {
  private logger = new Logger(MessageChannelsEntity.name);

  constructor(@Optional() _target: EntityTarget<MessageChannelsEntity>, entityManager: EntityManager) {
    super(MessageChannelsEntity, entityManager);
  }

  public async getChannel(userId: string, input: GetChannelInput) {
    return await this.createQueryBuilder('message_channels')
      .leftJoin('message_channels.creatorProfile', 'creator')
      .leftJoin('message_channels.fanProfile', 'fan')
      .addSelect(['creator.fullName', 'creator.username', 'creator.creatorId', 'creator.avatarUrl'])
      .addSelect(['fan.fullName', 'fan.username', 'fan.fanId', 'fan.avatarUrl'])
      .where('message_channels.id = :channelId', { channelId: input.channelId })
      .andWhere('message_channels.creatorId = :userId OR message_channels.fanId = :userId', { userId: userId })
      .getOne();
  }

  public async getChannelByParticipants(input: { creatorId: string; fanId: string }) {
    return await this.createQueryBuilder('mc')
      .leftJoinAndSelect('mc.participants', 'participants')
      .where(
        `EXISTS(
      SELECT 1 FROM message_channel_participants mcp1
      WHERE mcp1.message_channel_id = mc.id
      AND mcp1.user_id = :creatorId
      )`,
        { creatorId: input.creatorId },
      )
      .andWhere(
        `EXISTS(
        SELECT 1 FROM message_channel_participants mcp2
        WHERE mcp2.message_channel_id = mc.id
        AND mcp2.user_id = :fanId
        )`,
        { fanId: input.fanId },
      )
      .getOne();
  }

  public async getChannels(userId: string, input: PaginationInput) {
    return await this.createQueryBuilder('mc')
      .addSelect('mc.lastMessage', 'lastMessage')
      .leftJoin('mc.creatorProfile', 'creatorProfile')
      .leftJoin('mc.fanProfile', 'fanProfile')
      .leftJoin('fanProfile.user', 'fan_user')
      .leftJoin('creatorProfile.user', 'creator_user')
      .leftJoinAndSelect('mc.participants', 'mcp')
      .addSelect('mc.*')
      .addSelect('fanProfile.fanId')
      .addSelect('lastMessage.id')
      .addSelect('creatorProfile.creatorId')
      .addSelect(['fan_user.firstName', 'fan_user.lastName', 'fan_user.username', 'fan_user.avatarUrl'])
      .addSelect(['creator_user.firstName', 'creator_user.lastName', 'creator_user.username', 'creator_user.avatarUrl'])
      .where('mcp.userId = :userId', { userId: userId })
      .orderBy('lastMessage.createdAt', input.orderBy)
      .limit(input.limit)
      .getMany();
  }
}
