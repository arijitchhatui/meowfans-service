import { PaginationInput } from '@app/helpers';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorRestrictsEntity } from '../entities';

@Injectable()
export class CreatorRestrictsRepository extends Repository<CreatorRestrictsEntity> {
  private logger = new Logger(CreatorRestrictsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorRestrictsEntity>, entityManager: EntityManager) {
    super(CreatorRestrictsEntity, entityManager);
  }

  public async getRestrictedUsers(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('crs')
      .leftJoin('crs.fanProfile', 'fan')
      .leftJoin('fan.user', 'user')
      .addSelect('fan.fanId')
      .addSelect(['user.firstName', 'user.lastName', 'user.avatarUrl', 'user.username'])
      .where('crs.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('crs.restrictedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }
}
