import { PaginationInput } from '@app/helpers';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { DataFetchType, FileType } from '../../../util/enums';
import { DownloadStates } from '../../../util/enums/download-state';
import { GetAllObjectsCountOutput } from '../../vaults/dto';
import { VaultObjectsEntity } from '../entities';

@Injectable()
export class VaultsObjectsRepository extends Repository<VaultObjectsEntity> {
  constructor(@Optional() _target: EntityTarget<VaultObjectsEntity>, entityManager: EntityManager) {
    super(VaultObjectsEntity, entityManager);
  }

  public async updateStatusToFulfilledState(objectUrl: string) {
    await this.findOneOrFail({ where: { objectUrl: objectUrl } });
    await this.update({ objectUrl: objectUrl }, { status: DownloadStates.FULFILLED });
  }

  public async updateStatusToRejectedState(url: string) {
    await this.findOneOrFail({ where: { objectUrl: url } });
    await this.update({ objectUrl: url }, { status: DownloadStates.PENDING });
  }

  public async getCreatorVaultObjectsCount(creatorId: string) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vault.creatorId =: creatorId', { creatorId: creatorId })
      .andWhere('vo.fileType = :fileType', { fileType: FileType.IMAGE })
      .getCount();
  }

  public creatorVaultObjects(creatorId: string, input: PaginationInput) {
    return this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .leftJoinAndSelect('vault.creatorProfile', 'creatorProfile')
      .leftJoinAndSelect('creatorProfile.user', 'user')
      .where('vault.creatorId = :creatorId', { creatorId: creatorId })
      .andWhere('vault.id = vo.vaultId')
      .andWhere('vo.status = :status', { status: input.status })
      .andWhere('vo.fileType = :fileType', { fileType: FileType.IMAGE })
      .limit(input.limit)
      .offset(input.offset)
      .orderBy(
        `
        CASE vo.status
        WHEN 'PROCESSING' THEN 4
        WHEN 'REJECTED' THEN 3
        WHEN 'PENDING' THEN 2
        WHEN 'FULFILLED' THEN 1
        END
        `,
        input.orderBy,
      );
  }

  public async getTotalStatsOfObjectsOfACreator(creatorId: string, status: DownloadStates) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vault.creatorId = :creatorId', { creatorId: creatorId })
      .andWhere('vo.status = :status', { status: status })
      .andWhere('vo.fileType = :fileType', { fileType: FileType.IMAGE })
      .getCount();
  }

  public async getTotalVaultObjectsAsType(status: DownloadStates) {
    return await this.createQueryBuilder('vo').where('vo.status = :status', { status: status }).getCount();
  }

  public getCreatorVaultObjects(creatorId: string, input: PaginationInput) {
    return this.creatorVaultObjects(creatorId, input);
  }

  public async getCountOfObjectsOfEachType() {
    const result = await this.createQueryBuilder('vault')
      .select([
        `COUNT(*) FILTER (WHERE vault.status = 'PENDING') AS pending`,
        `COUNT(*) FILTER (WHERE vault.status = 'PROCESSING') AS processing`,
        `COUNT(*) FILTER (WHERE vault.status = 'REJECTED') AS rejected`,
        `COUNT(*) FILTER (WHERE vault.status = 'FULFILLED') AS fulfilled`,
      ])
      .getRawOne<GetAllObjectsCountOutput>();
    return result ?? { pending: 0, processing: 0, rejected: 0, fulfilled: 0 };
  }

  public async getCountOfObjectsOfEachTypeOfACreator(creatorId: string): Promise<GetAllObjectsCountOutput> {
    const result = await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .select([
        `COUNT(*) FILTER (WHERE vo.status = 'PENDING') AS pending`,
        `COUNT(*) FILTER (WHERE vo.status = 'PROCESSING') AS processing`,
        `COUNT(*) FILTER (WHERE vo.status = 'REJECTED') AS rejected`,
        `COUNT(*) FILTER (WHERE vo.status = 'FULFILLED') AS fulfilled`,
      ])
      .where('vault.creatorId = :creatorId', { creatorId })
      .getRawOne<GetAllObjectsCountOutput>();
    return result ?? { pending: 0, processing: 0, fulfilled: 0, rejected: 0 };
  }

  public async getCreatorTotalVaultObjectsCount(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vo.status = :status', { status: input.status })
      .andWhere('vault.creatorId = :creatorId', { creatorId: creatorId })
      .andWhere('vo.fileType = :fileType', { fileType: FileType.IMAGE })
      .getCount();
  }

  public async getTotalPendingObjectsOfACreator(creatorId: string) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vo.status IN (:...status)', { status: [DownloadStates.PENDING, DownloadStates.PROCESSING] })
      .andWhere('vault.creatorId = :creatorId', { creatorId: creatorId })
      .andWhere('vo.fileType = :fileType', { fileType: FileType.IMAGE })
      .getMany();
  }

  public async getAllVaults(input: PaginationInput) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vo.status = :status', { status: input.status })
      .andWhere('vo.fileType = :fileType', { fileType: FileType.IMAGE })
      .limit(input.limit)
      .offset(input.offset)
      .orderBy('vault.createdAt', input.orderBy)
      .getManyAndCount();
  }

  public async cleanUpVaultObjectsOfACreator(creatorId: string) {
    return await this.createQueryBuilder()
      .update(VaultObjectsEntity)
      .set({ status: DownloadStates.PENDING })
      .where('status = :status', { status: DownloadStates.PROCESSING })
      .andWhere(
        `"vault_id" IN (
         SELECT v.id FROM vaults v WHERE v.creator_id = :creatorId
       )`,
        { creatorId },
      )
      .execute();
  }

  public async getVaultObjectsByVaultId(input: PaginationInput) {
    switch (input.dataFetchType) {
      case DataFetchType.Pagination: {
        const { pageNumber, take } = input;
        const skip = (pageNumber - 1) * take;

        const [vaultObjects, count] = await this.findAndCount({
          where: { vaultId: input.relatedEntityId },
          relations: { asset: true, vault: { creatorProfile: { user: true } } },
          take,
          skip,
          order: { createdAt: input.orderBy },
        });

        const totalPages = Math.ceil(count / take);
        const hasPrev = pageNumber > 1;
        const hasNext = pageNumber < totalPages;

        return { vaultObjects, count, totalPages, hasNext, hasPrev };
      }

      default: {
        const { skip, take } = input;

        const [vaultObjects] = await this.findAndCount({
          where: { vaultId: input.relatedEntityId },
          relations: { asset: true, vault: { creatorProfile: { user: true } } },
          take,
          skip,
          order: { createdAt: input.orderBy },
        });

        return { vaultObjects };
      }
    }
  }
}
