import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostLikesEntity } from '../entities';

@Injectable()
export class PostLikesRepository extends Repository<PostLikesEntity> {
  private logger = new Logger(PostLikesEntity.name);

  constructor(@Optional() _target: EntityTarget<PostLikesEntity>, entityManager: EntityManager) {
    super(PostLikesEntity, entityManager);
  }
}
