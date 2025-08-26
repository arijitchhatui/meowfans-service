import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { MessageReactionsEntity } from '../entities';

@Injectable()
export class MessageReactionsRepository extends Repository<MessageReactionsEntity> {
  private logger = new Logger(MessageReactionsEntity.name);

  public constructor(@Optional() _target: EntityTarget<MessageReactionsEntity>, entityManager: EntityManager) {
    super(MessageReactionsEntity, entityManager);
  }
}
