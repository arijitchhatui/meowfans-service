import { PaginationInput } from '@app/helpers';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { VaultsEntity } from '../entities/vaults.entity';

@Injectable()
export class VaultsRepository extends Repository<VaultsEntity> {
  constructor(@Optional() _target: EntityTarget<VaultsEntity>, entityManager: EntityManager) {
    super(VaultsEntity, entityManager);
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
