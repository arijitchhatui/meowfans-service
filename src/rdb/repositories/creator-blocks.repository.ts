import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetBlockedUsersInput } from 'src/creator-profiles';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorBlocksEntity } from '../entities';

@Injectable()
export class CreatorBlocksRepository extends Repository<CreatorBlocksEntity> {
  private logger = new Logger(CreatorBlocksEntity.name);

  constructor(@Optional() _target: EntityTarget<CreatorBlocksEntity>, entityManager: EntityManager) {
    super(CreatorBlocksEntity, entityManager);
  }

  public async getBlockedUsers(creatorId: string, input: GetBlockedUsersInput) {
    const query = this.createQueryBuilder('creator_blocks')
      .leftJoin('creator_blocks.blockedUserProfile', 'userProfile')
      .addSelect(['userProfile.username', 'userProfile.fullName', 'userProfile.avatarUrl', 'userProfile.userId'])
      .where('creator_blocks.blockingCreatorId = :creatorId', { creatorId: creatorId })
      .limit(30)
      .offset(input.offset);

    return await query.getMany();
  }
}
