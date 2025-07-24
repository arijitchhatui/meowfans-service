import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { MessageAssetsEntity } from '../entities';

@Injectable()
export class MessageAssetsRepository extends Repository<MessageAssetsEntity> {
  private logger = new Logger(MessageAssetsEntity.name);

  public constructor(@Optional() _target: EntityTarget<MessageAssetsEntity>, entityManager: EntityManager) {
    super(MessageAssetsEntity, entityManager);
  }
}
