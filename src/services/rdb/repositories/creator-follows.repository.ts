import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { EntityMaker } from '../../../lib/methods';
import { GetFollowedUsersOutput, GetFollowingUsersOutput } from '../../creator-profiles';
import { CreatorFollowsEntity } from '../entities';

@Injectable()
export class CreatorFollowsRepository extends Repository<CreatorFollowsEntity> {
  private logger = new Logger(CreatorFollowsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorFollowsEntity>, entityManager: EntityManager) {
    super(CreatorFollowsEntity, entityManager);
  }

  public async getFollowers(creatorId: string, input: PaginationInput) {
    const query = this.createQueryBuilder('cfs')
      .leftJoin('users', 'fanProfile', 'fanProfile.id = cfs.fanId')
      .select('cfs.*')
      .addSelect('fanProfile.firstName')
      .addSelect('fanProfile.lastName')
      .addSelect('fanProfile.username')
      .addSelect('fanProfile.avatarUrl')
      .where('cfs.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('cfs.followedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getRawMany<GetFollowedUsersOutput>();

    return await EntityMaker.fromRawToEntityType<GetFollowedUsersOutput>({
      rawQueryMap: query,
      mappers: [{ aliasName: 'fanProfile', entityFieldOutputName: 'fanProfile' }],
    });
  }

  public async getFollowing(fanId: string, input: PaginationInput) {
    const query = this.createQueryBuilder('cfs')
      .leftJoin('users', 'creatorProfile', 'creatorProfile.id = cfs.creatorId')
      .select('cfs.*')
      .addSelect('creatorProfile.firstName')
      .addSelect('creatorProfile.lastName')
      .addSelect('creatorProfile.username')
      .addSelect('creatorProfile.avatarUrl')
      .where('cfs.fanId = :fanId', { fanId: fanId })
      .orderBy('cfs.followedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getRawMany<GetFollowingUsersOutput>();

    return await EntityMaker.fromRawToEntityType<GetFollowingUsersOutput>({
      rawQueryMap: query,
      mappers: [{ aliasName: 'creatorProfile', entityFieldOutputName: 'creatorProfile' }],
    });
  }
}
