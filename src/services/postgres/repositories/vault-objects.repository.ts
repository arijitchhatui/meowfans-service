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

  public async getCreatorVaultObjects(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('vo')
      .leftJoinAndSelect('vo.vault', 'vault')
      .where('vault.creatorId = :creatorId', { creatorId: creatorId })
      .andWhere('vault.id = vo.vaultId')
      .andWhere('vault.status')
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
      )
      .getMany();
  }
}
