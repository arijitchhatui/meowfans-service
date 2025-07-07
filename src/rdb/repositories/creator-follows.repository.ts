import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorFollowsEntity } from '../entities';

@Injectable()
export class CreatorFollowsRepository extends Repository<CreatorFollowsEntity> {
  private logger = new Logger(CreatorFollowsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorFollowsEntity>, entityManager: EntityManager) {
    super(CreatorFollowsEntity, entityManager);
  }
}
