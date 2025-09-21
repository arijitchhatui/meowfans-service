import { PaginationInput } from '@app/helpers';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { DownloadStates } from '../../../util/enums/download-state';
import { VaultsEntity } from '../entities/vaults.entity';

@Injectable()
export class VaultsRepository extends Repository<VaultsEntity> {
  constructor(@Optional() _target: EntityTarget<VaultsEntity>, entityManager: EntityManager) {
    super(VaultsEntity, entityManager);
  }

  public async updateStatusToFulfilledState(creatorId: string, url: string) {
    await this.findOneOrFail({ where: { creatorId: creatorId, url: url } });
    await this.update({ creatorId: creatorId, url: url }, { status: DownloadStates.FULFILLED });
  }

  public async updateStatusToRejectedState(creatorId: string, id: string) {
    await this.findOneOrFail({ where: { creatorId: creatorId, id: id } });
    await this.update({ creatorId: creatorId, id: id }, { status: DownloadStates.REJECTED });
  }

  public async getCreatorVaults(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('cv')
      .where('cv.creatorId = :creatorId', { creatorId })
      .orderBy('cv.createdAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }
}
