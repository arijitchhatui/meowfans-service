import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { GetRestrictedUsersInput } from '../../creator-profiles';
import { CreatorRestrictsEntity } from '../entities';

@Injectable()
export class CreatorRestrictsRepository extends Repository<CreatorRestrictsEntity> {
  private logger = new Logger(CreatorRestrictsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorRestrictsEntity>, entityManager: EntityManager) {
    super(CreatorRestrictsEntity, entityManager);
  }

  public async getRestrictedUsers(creatorId: string, input: GetRestrictedUsersInput) {
    const query = this.createQueryBuilder('creator_restricts')
      .leftJoin('creator_restricts.fanProfile', 'fanProfile')
      .addSelect(['fanProfile.fullName', 'fanProfile.username', 'fanProfile.fanId', 'fanProfile.avatarUrl'])
      .where('creator_restricts.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('creator_restricts.restrictedAt', 'DESC')
      .limit(30)
      .offset(input.offset);

    return await query.getMany();
  }
}
