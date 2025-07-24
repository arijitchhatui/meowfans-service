import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../util';
import { MessageChannelsEntity, MessagesEntity } from '../entities';
import { GetChannelInput, GetChannelsOutput } from '../../message-channels/dto';

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

  public async getChannels(userId: string, input: PaginationInput) {
    const messageSubQuery = this.createQueryBuilder()
      .select('DISTINCT ON (m."channel_id") m."channel_id"', 'channelId')
      .addSelect('m."content"', 'lastMessage')
      .addSelect('m."created_at"', 'messageSentAt')
      .from(MessagesEntity, 'm')
      .orderBy('m."channel_id"')
      .addOrderBy('m."created_at"', 'DESC');

    const query = this.createQueryBuilder('message_channels')
      .leftJoin(`(${messageSubQuery.getQuery()})`, 'lastMessage', '"lastMessage"."channelId" = message_channels.id')
      .setParameters(messageSubQuery.getParameters())
      .addSelect('"lastMessage"."lastMessage"', 'lastMessage')
      .leftJoin('message_channels.creatorProfile', 'creatorProfile')
      .leftJoin('message_channels.fanProfile', 'fanProfile')
      .addSelect('fanProfile.fullName', 'fanFullName')
      .addSelect('message_channels.id', 'id')
      .addSelect('message_channels.creatorId', 'creatorId')
      .addSelect('message_channels.fanId', 'fanId')
      .addSelect('message_channels.creatorLastSentAt', 'creatorLastSentAt')
      .addSelect('message_channels.creatorLastSeenAt', 'creatorLastSeenAt')
      .addSelect('message_channels.fanLastSentAt', 'fanLastSentAt')
      .addSelect('message_channels.fanLastSeenAt', 'fanLastSeenAt')
      .addSelect('message_channels.isPinned', 'isPinned')
      .addSelect('message_channels.label', 'label')
      .addSelect('message_channels.isMuted', 'isMuted')
      .addSelect('message_channels.isRestricted', 'isRestricted')
      .addSelect('message_channels.isMessagingBlocked', 'isMessagingBlocked')
      .addSelect('message_channels.totalEarning', 'totalEarning')
      .addSelect('message_channels.createdAt', 'createdAt')
      .addSelect('message_channels.deletedAt', 'deletedAt')
      .addSelect('creatorProfile.fullName', 'creatorFullName')
      .where('message_channels.creatorId = :userId OR message_channels.fanId = :userId', { userId: userId })
      .orderBy('GREATEST(message_channels.creatorLastSentAt, message_channels.fanLastSentAt)', input.orderBy);

    return await query.getRawMany<GetChannelsOutput>();
  }
}
