import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { CreatorFollowsEntity } from '../entities';

@Injectable()
export class CreatorFollowsRepository extends Repository<CreatorFollowsEntity> {
  private logger = new Logger(CreatorFollowsEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorFollowsEntity>, entityManager: EntityManager) {
    super(CreatorFollowsEntity, entityManager);
  }

  public async restoreOrCreateFollow(input: { fanId: string; creatorId: string }): Promise<CreatorFollowsEntity> {
    const { fanId, creatorId } = input;

    const { generatedMaps } = await this.upsert(
      { creatorId: creatorId, fanId: fanId },
      { conflictPaths: ['fanId', 'creatorId'], skipUpdateIfNoValuesChanged: true },
    );

    return this.create(generatedMaps[0]);
  }

  public async getFollowers(creatorId: string, input: PaginationInput): Promise<CreatorFollowsEntity[]> {
    return await this.createQueryBuilder('cfs')
      .leftJoin('cfs.fanProfile', 'fan')
      .leftJoin('fan.user', 'user')
      .addSelect('fan.fanId')
      .addSelect(['user.username', 'user.firstName', 'user.lastName', 'user.avatarUrl'])
      .where('cfs.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('cfs.followedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }

  public async getFollowing(fanId: string, input: PaginationInput): Promise<CreatorFollowsEntity[]> {
    return await this.createQueryBuilder('cfs')
      .leftJoin('cfs.creatorProfile', 'creator')
      .leftJoin('creator.user', 'user')
      .addSelect('creator.creatorId')
      .addSelect(['user.username', 'user.firstName', 'user.lastName', 'user.avatarUrl', 'user.bannerUrl'])
      .where('cfs.fanId = :fanId', { fanId: fanId })
      .orderBy('cfs.followedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }
}
