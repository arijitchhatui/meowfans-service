import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { MessageAccessEntity } from '../entities';

@Injectable()
export class MessageAccessRepository extends Repository<MessageAccessEntity> {
  private logger = new Logger(MessageAccessEntity.name);

  public constructor(@Optional() _target: EntityTarget<MessageAccessEntity>, entityManager: EntityManager) {
    super(MessageAccessEntity, entityManager);
  }
}
