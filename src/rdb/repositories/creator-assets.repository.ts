import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorAssetsEntity } from '../entities';
import { GetCreatorAssetsInput } from '../../assets';

@Injectable()
export class CreatorAssetsRepository extends Repository<CreatorAssetsEntity> {
  private logger = new Logger(CreatorAssetsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorAssetsEntity>, entityManager: EntityManager) {
    super(CreatorAssetsEntity, entityManager);
  }

  public async getCreatorAssets(creatorId: string, input: GetCreatorAssetsInput) {
    const query = this.createQueryBuilder('creator_assets')
      .leftJoinAndSelect('creator_assets.asset', 'asset')
      .where('creator_assets.assetId = asset.id')
      .andWhere('creator_assets.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('creator_assets.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset);

    return await query.getMany();
  }
}
