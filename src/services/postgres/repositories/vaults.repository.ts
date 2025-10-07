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
      .leftJoinAndSelect('creatorProfile.user', 'user')
      .where('user.username = :username', { username: 'porn' })
      .skip(input.skip)
      .take(input.take);

    return qb.getManyAndCount();
  }
}
