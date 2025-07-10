import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostSavesEntity } from '../entities';

@Injectable()
export class PostSavesRepository extends Repository<PostSavesEntity> {
  private logger = new Logger(PostSavesEntity.name);

  constructor(@Optional() _target: EntityTarget<PostSavesEntity>, entityManager: EntityManager) {
    super(PostSavesEntity, entityManager);
  }
}
