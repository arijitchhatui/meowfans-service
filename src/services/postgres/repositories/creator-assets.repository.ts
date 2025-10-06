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
      .leftJoinAndSelect('asset.vaultObject', 'vaultObject')
      .leftJoinAndSelect('vaultObject.vault', 'vault')
      .leftJoinAndSelect('ca.creatorProfile', 'creatorProfile')
      .leftJoinAndSelect('creatorProfile.user', 'user')
      .where('user.username = :username', { username: creatorId })
      .andWhere('ca.type = :type', { type: await this.insertAssetType(input.assetType) })
      .orderBy('vaultObject.suffix', input.orderBy)
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

  public async getAllAssets(input: PaginationInput) {
    return await this.createQueryBuilder('c_asset')
      .leftJoinAndSelect('c_asset.asset', 'asset')
      .leftJoinAndSelect('c_asset.creatorProfile', 'creatorProfile')
      .leftJoinAndSelect('creatorProfile.user', 'user')
      .where('c_asset.type = :type', { type: input.assetType })
      .limit(input.limit)
      .offset(input.offset)
      .orderBy('asset.createdAt', input.orderBy)
      .getManyAndCount();
  }

  public async getCreatorsAssetsCount(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('ca')
      .where('ca.type = :type', { type: input.assetType })
      .andWhere('ca.creatorId = :creatorId', { creatorId: creatorId })
      .getCount();
  }
}
