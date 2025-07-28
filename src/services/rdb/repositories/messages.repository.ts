import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../service.constants';
import { MessagesEntity } from '../entities';

@Injectable()
export class MessagesRepository extends Repository<MessagesEntity> {
  private logger = new Logger(MessagesEntity.name);

  public constructor(@Optional() _target: EntityTarget<MessagesEntity>, entityManager: EntityManager) {
    super(MessagesEntity, entityManager);
  }
  public getChannelMessages(userId: string, input: PaginationInput) {
    return this.createQueryBuilder('messages')
      .where('messages.channelId = :channelId', { channelId: input.relatedEntityId })
      .andWhere('messages.senderId = :userId OR messages.recipientUserId = :userId', { userId: userId })
      .orderBy('messages.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset)
      .getMany();
  }
}
