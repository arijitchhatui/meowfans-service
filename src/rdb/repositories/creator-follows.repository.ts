import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetFollowersInput } from 'src/creator-profiles';
import { GetFollowingInput } from 'src/fan-profiles';
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
      .leftJoin('creator_follows.fanProfile', 'fanProfile')
      .addSelect(['fanProfile.username', 'fanProfile.fanId', 'fanProfile.fullName', 'fanProfile.avatarUrl'])
      .where('creator_follows.creatorId = :creatorId', { creatorId: creatorId })
      .limit(40)
      .offset(input.offset);

    return await query.getMany();
  }

  public async getFollowing(fanId: string, input: GetFollowingInput) {
    const query = this.createQueryBuilder('creator_follows')
      .leftJoin('creator_follows.creatorProfile', 'creatorProfile')
      .addSelect([
        'creatorProfile.username',
        'creatorProfile.fullName',
        'creatorProfile.avatarUrl',
        'creatorProfile.creatorId',
      ])
      .where('creator_follows.fanId = :fanId', { fanId: fanId })
      .limit(40)
      .offset(input.offset);

    return await query.getMany();
  }
}
