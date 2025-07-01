import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostsEntity } from '../entities/posts.entity';

@Injectable()
export class PostsRepository extends Repository<PostsEntity> {
  private logger = new Logger(PostsRepository.name);

  constructor(@Optional() _target: EntityTarget<PostsEntity>, entityManager: EntityManager) {
    super(PostsEntity, entityManager);
  }
}
