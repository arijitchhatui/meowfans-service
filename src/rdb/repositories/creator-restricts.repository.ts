import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorRestrictsEntity } from '../entities';

@Injectable()
export class CreatorRestrictsRepository extends Repository<CreatorRestrictsEntity> {
  private logger = new Logger(CreatorRestrictsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorRestrictsEntity>, entityManager: EntityManager) {
    super(CreatorRestrictsEntity, entityManager);
  }
}
