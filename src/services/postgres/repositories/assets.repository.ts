import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { AssetsEntity } from '../entities';

@Injectable()
export class AssetsRepository extends Repository<AssetsEntity> {
  private logger = new Logger(AssetsEntity.name);

  constructor(@Optional() _target: EntityTarget<AssetsEntity>, entityManager: EntityManager) {
    super(AssetsEntity, entityManager);
  }
}
