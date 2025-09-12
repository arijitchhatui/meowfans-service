import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { GetChannelInput, GetChannelsOutput } from '../../message-channels/dto';
import { MessageChannelsEntity, MessagesEntity } from '../entities';
import { PaginationInput } from '@app/helpers';
import { EntityMaker } from '@app/methods';

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
      .addSelect('message_channels.*')
      .addSelect('creatorProfile.fullName', 'creatorFullName')
      .where('message_channels.creatorId = :userId OR message_channels.fanId = :userId', { userId: userId })
      .orderBy('GREATEST(message_channels.creatorLastSentAt, message_channels.fanLastSentAt)', input.orderBy)
      .getRawMany<GetChannelsOutput>();

    return EntityMaker.fromRawToEntityType<GetChannelsOutput>({
      rawQueryMap: query,
      mappers: [{ aliasName: 'message_channels' }],
    });
  }
}
