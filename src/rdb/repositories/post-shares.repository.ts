import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostSharesEntity } from '../entities';

@Injectable()
export class PostSharesRepository extends Repository<PostSharesEntity> {
  private logger = new Logger(PostSharesEntity.name);

  constructor(@Optional() _target: EntityTarget<PostSharesEntity>, entityManager: EntityManager) {
    super(PostSharesEntity, entityManager);
  }
}
