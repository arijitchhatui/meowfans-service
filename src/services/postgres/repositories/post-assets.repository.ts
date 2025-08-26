import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostAssetsEntity } from '../entities';

@Injectable()
export class PostAssetsRepository extends Repository<PostAssetsEntity> {
  private logger = new Logger(PostAssetsEntity.name);

  constructor(@Optional() _target: EntityTarget<PostAssetsEntity>, entityManager: EntityManager) {
    super(PostAssetsEntity, entityManager);
  }
}
