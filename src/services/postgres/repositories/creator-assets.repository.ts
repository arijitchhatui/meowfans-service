import { PaginationInput } from '@app/helpers';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { AssetType } from '../../../util/enums';
import { UpdateAssetsInput } from '../../assets';
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
      .andWhere('ca.type = :type', { type: await this.insertAssetType(input.assetType) })
      .orderBy('ca.createdAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }

  public async updateAssetType(creatorId: string, input: UpdateAssetsInput) {
    const updatedAssets: CreatorAssetsEntity[] = [];
    await Promise.all(
      input.assetIds.map(async (assetId) => {
        const creatorAsset = await this.findOne({
          where: { creatorId: creatorId, assetId: assetId },
          relations: { asset: true },
        });
        if (creatorAsset) {
          const updated = await this.save(Object.assign(creatorAsset, { type: input.assetType }));
          updatedAssets.push(updated);
        }
      }),
    );
    return updatedAssets ?? [];
  }

  private async insertAssetType(assetType?: AssetType | null): Promise<AssetType> {
    return !assetType || !assetType.length ? AssetType.PRIVATE : assetType;
  }
}
