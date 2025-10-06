import { PaginationInput } from '@app/helpers';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { VaultsEntity } from '../entities/vaults.entity';

@Injectable()
export class VaultsRepository extends Repository<VaultsEntity> {
  private logger = new Logger(VaultsRepository.name);

  constructor(@Optional() _target: EntityTarget<VaultsEntity>, entityManager: EntityManager) {
    super(VaultsEntity, entityManager);
  }

  public async getDefaultVaults(input: PaginationInput) {
    const qb = this.createQueryBuilder('v')
      .innerJoinAndSelect('v.creatorProfile', 'creatorProfile')
      .innerJoinAndSelect('v.vaultObjects', 'vaultObjects')
      .leftJoinAndSelect('vaultObjects.asset', 'asset')
      .leftJoinAndSelect('creatorProfile.user', 'user')
      .where('user.username = :username', { username: 'porn' })
      .orderBy('v.createdAt', input.orderBy)
      .skip(input.skip)
      .take(input.take);

    // console.log(qb.getSql());
    return qb.getManyAndCount();
  }
}
