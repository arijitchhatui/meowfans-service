import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorAssetsEntity } from '../entities';

@Injectable()
export class CreatorAssetsRepository extends Repository<CreatorAssetsEntity> {
  private logger = new Logger(CreatorAssetsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorAssetsEntity>, entityManager: EntityManager) {
    super(CreatorAssetsEntity, entityManager);
  }
}
