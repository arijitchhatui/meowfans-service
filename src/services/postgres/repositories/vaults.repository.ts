import { PaginationInput } from '@app/helpers';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { DEFAULT_BANNER_URL } from '../../../util/constants';
import { VaultsEntity } from '../entities/vaults.entity';

@Injectable()
export class VaultsRepository extends Repository<VaultsEntity> {
  private logger = new Logger(VaultsRepository.name);

  constructor(@Optional() _target: EntityTarget<VaultsEntity>, entityManager: EntityManager) {
    super(VaultsEntity, entityManager);
  }

  public async getDefaultVaults(input: PaginationInput) {
    const qb = this.createQueryBuilder('v')
      .leftJoin('v.creatorProfile', 'creatorProfile')
      .leftJoin('creatorProfile.user', 'user')
      .innerJoin('v.vaultObjects', 'vo')
      .innerJoin('vo.asset', 'asset')
      .leftJoin('v.tags', 'tags')
      .addSelect(['user.id', 'user.username', 'user.avatarUrl', 'user.bannerUrl'])
      .addSelect(['tags.id', 'tags.label'])
      .addSelect(['creatorProfile.creatorId']);

    if (input.searchTerm?.length) {
      qb.andWhere(
        '(tags.label ILIKE :searchTerm OR user.username ILIKE :searchTerm OR v.description  ILIKE :searchTerm)',
        { searchTerm: `%${input.searchTerm}%` },
      );
    }

    qb.andWhere('v.preview != :defaultPreview', { defaultPreview: DEFAULT_BANNER_URL })
      .skip(input.skip ?? 0)
      .take(input.take ?? 30)
      .orderBy('v.createdAt', 'DESC');
    return qb.getManyAndCount();
  }
}
