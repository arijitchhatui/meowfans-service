import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { EntityBuilder } from '../../../lib/methods/to-entity-type.method';
import { GetBlockedUsersOutput } from '../../creator-profiles';
import { CreatorBlocksEntity } from '../entities';

@Injectable()
export class CreatorBlocksRepository extends Repository<CreatorBlocksEntity> {
  private logger = new Logger(CreatorBlocksEntity.name);

  constructor(
    @Optional() _target: EntityTarget<CreatorBlocksEntity>,
    entityManager: EntityManager,
    private entityBuilder: EntityBuilder,
  ) {
    super(CreatorBlocksEntity, entityManager);
  }

  public async getBlockedUsers(creatorId: string, input: PaginationInput) {
    const query = this.createQueryBuilder('cbs')
      .leftJoin('users', 'user', 'user.id = cbs.fanId')
      .select('cbs.*')
      .addSelect('user.firstName')
      .addSelect('user.lastName')
      .addSelect('user.username')
      .addSelect('user.avatarUrl')
      .where('cbs.creatorId = :creatorId', { creatorId: creatorId })
      .limit(30)
      .offset(input.offset)
      .getRawMany<GetBlockedUsersOutput>();
    return await this.entityBuilder.toEntityType<GetBlockedUsersOutput>(query, { aliases: ['user'] });
  }
}
