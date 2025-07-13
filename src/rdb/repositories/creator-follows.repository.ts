import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetFollowersInput } from 'src/creator-profiles';
import { GetFollowingInput } from 'src/user-profiles';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorFollowsEntity } from '../entities';

@Injectable()
export class CreatorFollowsRepository extends Repository<CreatorFollowsEntity> {
  private logger = new Logger(CreatorFollowsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorFollowsEntity>, entityManager: EntityManager) {
    super(CreatorFollowsEntity, entityManager);
  }

  public async getFollowers(creatorId: string, input: GetFollowersInput) {
    const query = this.createQueryBuilder('creator_follows')
      .leftJoin('creator_follows.userProfile', 'userProfile')
      .addSelect(['userProfile.username', 'userProfile.userId', 'userProfile.fullName', 'userProfile.avatarUrl'])
      .where('creator_follows.followedCreatorId = :creatorId', { creatorId: creatorId })
      .limit(40)
      .offset(input.offset);

    return await query.getMany();
  }

  public async getFollowing(userId: string, input: GetFollowingInput) {
    const query = this.createQueryBuilder('creator_follows')
      .leftJoin('creator_follows.creatorProfile', 'creatorProfile')
      .addSelect([
        'creatorProfile.username',
        'creatorProfile.fullName',
        'creatorProfile.avatarUrl',
        'creatorProfile.creatorId',
      ])
      .where('creator_follows.followingUserId = :userId', { userId: userId })
      .limit(40)
      .offset(input.offset);

    return await query.getMany();
  }
}
