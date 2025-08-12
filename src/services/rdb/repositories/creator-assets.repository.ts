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
    const query = this.createQueryBuilder('creator_assets')
      .leftJoinAndSelect('creator_assets.asset', 'asset')
      .where('creator_assets.assetId = asset.id')
      .andWhere('creator_assets.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('creator_assets.createdAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset);

    return await query.getMany();
  }
}
