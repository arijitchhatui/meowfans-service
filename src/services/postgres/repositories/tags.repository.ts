import { PaginationInput } from '@app/helpers';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { TagsEntity } from '../entities';

@Injectable()
export class TagsRepository extends Repository<TagsEntity> {
  constructor(@Optional() _target: EntityTarget<TagsEntity>, entityManager: EntityManager) {
    super(TagsEntity, entityManager);
  }

  public async getTags(input: PaginationInput) {
    return await this.createQueryBuilder('t')
      .orderBy('t.label', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }
}
