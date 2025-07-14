import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetChannelInput } from 'src/messages/dto';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { MessageChannelsEntity, MessagesEntity } from '../entities';

@Injectable()
export class MessageChannelsRepository extends Repository<MessageChannelsEntity> {
  private logger = new Logger(MessageChannelsEntity.name);

  constructor(@Optional() _target: EntityTarget<MessageChannelsEntity>, entityManager: EntityManager) {
    super(MessageChannelsEntity, entityManager);
  }

  public async getChannel(userId: string, input: GetChannelInput) {
    const subQuery = this.createQueryBuilder('messages')
      .select('messages.id')
      .where('messages.channelId = message_channels.id')
      .orderBy('messages.createdAt', 'DESC')
      .limit(1);
    const query = this.createQueryBuilder('message_channels')
      .leftJoinAndMapOne(
        'message_channels.lastMessage',
        MessagesEntity,
        'lastMessage',
        `lastMessage.id = ${subQuery.getQuery()}`,
      )
      .setParameters(subQuery.getParameters())
      .leftJoinAndSelect('message_channels.creatorProfile', 'creatorProfile')
      .leftJoinAndSelect('message_channels.fanProfile', 'fanProfile')
      .where('message_channels.id = :channelId', { channelId: input.channelId })
      .andWhere('message_channels.creatorId = :userId OR message_channels.fanId = :userId', { userId: userId });

    return await query.getOne();
  }

  public async getChannels(userId: string) {
    const messageSubQuery = this.createQueryBuilder('messages')
      .select('messages.id')
      .where('messages.channelId = message_channels.id')
      .orderBy('messages.createdAt', 'DESC')
      .limit(1);

    const query = this.createQueryBuilder('message_channels')
      .leftJoinAndMapOne(
        'message_channels.lastMessage',
        MessagesEntity,
        'lastMessage',
        `lastMessage.id = ${messageSubQuery.getQuery()}`,
      )
      .setParameters(messageSubQuery.getParameters())
      .leftJoinAndSelect('message_channels.creatorProfile', 'creatorProfile')
      .leftJoinAndSelect('message_channels.fanProfile', 'fanProfile')
      .where('message_channels.creatorId = :userId OR message_channels.fanId = :userId', { userId: userId })
      .orderBy('GREATEST(message_channels.creatorLastSentAt, message_channels.fanLastSentAt)', 'DESC');

    return await query.getRawMany();
  }
}
