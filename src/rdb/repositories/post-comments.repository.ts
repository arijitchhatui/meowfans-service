import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostCommentsEntity } from '../entities';

@Injectable()
export class PostCommentsRepository extends Repository<PostCommentsEntity> {
  private logger = new Logger(PostCommentsEntity.name);

  constructor(@Optional() _target: EntityTarget<PostCommentsEntity>, entityManager: EntityManager) {
    super(PostCommentsEntity, entityManager);
  }
}
