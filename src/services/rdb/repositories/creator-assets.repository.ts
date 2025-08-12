import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { CreatorAssetsEntity } from '../entities';

@Injectable()
export class CreatorAssetsRepository extends Repository<CreatorAssetsEntity> {
  private logger = new Logger(CreatorAssetsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorAssetsEntity>, entityManager: EntityManager) {
    super(CreatorAssetsEntity, entityManager);
  }

  public async getCreatorAssets(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('ca')
      .leftJoinAndSelect('ca.asset', 'asset')
      .where('ca.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('ca.createdAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }
}
