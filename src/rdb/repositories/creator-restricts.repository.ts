import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetRestrictedUsersInput } from 'src/creator-profiles';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorRestrictsEntity } from '../entities';

@Injectable()
export class CreatorRestrictsRepository extends Repository<CreatorRestrictsEntity> {
  private logger = new Logger(CreatorRestrictsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorRestrictsEntity>, entityManager: EntityManager) {
    super(CreatorRestrictsEntity, entityManager);
  }

  public async getRestrictedUsers(creatorId: string, input: GetRestrictedUsersInput) {
    const query = this.createQueryBuilder('creator_restricts')
      .leftJoin('creator_restricts.restrictedUserProfile', 'userProfile')
      .addSelect(['userProfile.fullName', 'userProfile.username', 'userProfile.userId', 'userProfile.avatarUrl'])
      .where('creator_restricts.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('creator_restricts.restrictedAt', 'DESC')
      .limit(30)
      .offset(input.offset);

    return await query.getMany();
  }
}
