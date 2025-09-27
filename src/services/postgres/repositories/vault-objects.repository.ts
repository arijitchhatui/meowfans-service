import { PaginationInput } from '@app/helpers';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { DownloadStates } from '../../../util/enums/download-state';
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
      .getCount();
  }

  public async getTotalVaultObjectsAsType(status: DownloadStates) {
    return await this.createQueryBuilder('vo').where('vo.status = :status', { status: status }).getCount();
  }

  public getCreatorVaultObjects(creatorId: string, input: PaginationInput) {
    return this.creatorVaultObjects(creatorId, input);
  }

  public async getCreatorTotalVaultObjectsCount(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vo.status = :status', { status: input.status })
      .andWhere('vault.creatorId = :creatorId', { creatorId: creatorId })
      .getCount();
  }

  public async getTotalPendingObjectsOfACreator(creatorId: string) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vo.status IN (:...status)', { status: [DownloadStates.PENDING, DownloadStates.PROCESSING] })
      .andWhere('vault.creatorId = :creatorId', { creatorId: creatorId })
      .getMany();
  }

  public async getAllVaults(input: PaginationInput) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vo.status = :status', { status: input.status })
      .limit(input.limit)
      .offset(input.offset)
      .orderBy('vault.createdAt', input.orderBy)
      .getManyAndCount();
  }
}
