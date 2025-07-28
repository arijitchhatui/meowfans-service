import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { convertRawToEntityType, PaginationInput } from '../../../lib/helpers';
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
      .leftJoin('users', 'user', 'user.id = cfs.fanId')
      .select('cfs.*')
      .addSelect('user.firstName')
      .addSelect('user.lastName')
      .addSelect('user.username')
      .addSelect('user.avatarUrl')
      .where('cfs.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('cfs.followedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getRawMany<GetFollowedUsersOutput>();

    return await convertRawToEntityType<GetFollowedUsersOutput>(query, { prefixes: ['user'] });
  }

  public async getFollowing(fanId: string, input: PaginationInput) {
    const query = this.createQueryBuilder('cfs')
      .leftJoin('users', 'user', 'user.id = cfs.fanId')
      .select('cfs.*')
      .addSelect('user.firstName')
      .addSelect('user.lastName')
      .addSelect('user.username')
      .addSelect('user.avatarUrl')
      .where('cfs.fanId = :fanId', { fanId: fanId })
      .orderBy('cfs.followedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getRawMany<GetFollowingUsersOutput>();

    return await convertRawToEntityType<GetFollowingUsersOutput>(query, { prefixes: ['user'] });
  }
}
