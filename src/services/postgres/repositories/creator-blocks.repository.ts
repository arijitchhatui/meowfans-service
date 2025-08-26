import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { CreatorBlocksEntity } from '../entities';

@Injectable()
export class CreatorBlocksRepository extends Repository<CreatorBlocksEntity> {
  private logger = new Logger(CreatorBlocksEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorBlocksEntity>, entityManager: EntityManager) {
    super(CreatorBlocksEntity, entityManager);
  }

  public async getBlockedUsers(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('cbs')
      .leftJoin('cbs.fanProfile', 'fan')
      .leftJoin('fan.user', 'user')
      .addSelect('fan.fanId')
      .addSelect(['user.firstName', 'user.lastName', 'user.avatarUrl', 'user.username'])
      .where('cbs.creatorId = :creatorId', { creatorId: creatorId })
      .limit(input.limit)
      .orderBy('cbs.createdAt', input.orderBy)
      .offset(input.offset)
      .getMany();
  }
}
