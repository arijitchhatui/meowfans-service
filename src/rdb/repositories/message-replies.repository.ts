import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { MessageRepliesEntity } from '../entities';

@Injectable()
export class MessageRepliesRepository extends Repository<MessageRepliesEntity> {
  private logger = new Logger(MessageRepliesEntity.name);

  public constructor(@Optional() _target: EntityTarget<MessageRepliesEntity>, entityManager: EntityManager) {
    super(MessageRepliesEntity, entityManager);
  }
}
