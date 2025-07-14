import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetMessagesInput } from 'src/messages/dto';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { MessagesEntity } from '../entities';

@Injectable()
export class MessagesRepository extends Repository<MessagesEntity> {
  private logger = new Logger(MessagesEntity.name);

  public constructor(@Optional() _target: EntityTarget<MessagesEntity>, entityManager: EntityManager) {
    super(MessagesEntity, entityManager);
  }
  public getChannelMessages(userId: string, input: GetMessagesInput) {
    return this.createQueryBuilder('messages')
      .where('messages.channelId = :channelId', { channelId: input.channelId })
      .andWhere('messages.creatorId = :userId OR messages.fanId = :userId', { userId: userId })
      .orderBy('messages.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset)
      .getMany();
  }
}
