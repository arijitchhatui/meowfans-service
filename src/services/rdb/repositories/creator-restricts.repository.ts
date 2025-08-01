import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { EntityMaker } from '../../../lib/methods';
import { GetRestrictedUsersOutput } from '../../creator-profiles';
import { CreatorRestrictsEntity } from '../entities';

@Injectable()
export class CreatorRestrictsRepository extends Repository<CreatorRestrictsEntity> {
  private logger = new Logger(CreatorRestrictsEntity.name);

  constructor(
    @Optional() _target: EntityTarget<CreatorRestrictsEntity>,
    entityManager: EntityManager,
    private entityBuilder: EntityMaker,
  ) {
    super(CreatorRestrictsEntity, entityManager);
  }

  public async getRestrictedUsers(creatorId: string, input: PaginationInput) {
    const query = this.createQueryBuilder('crs')
      .leftJoin('users', 'user', 'user.id = crs.fanId')
      .select('crs.*')
      .addSelect('user.email')
      .addSelect('user.firstName')
      .addSelect('user.lastName')
      .addSelect('user.username')
      .addSelect('user.avatarUrl')
      .where('crs.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('crs.restrictedAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getRawMany<GetRestrictedUsersOutput>();

    return await this.entityBuilder.fromRawToEntityType<GetRestrictedUsersOutput>({
      rawQueryMap: query,
      mappers: [{ entityFieldOutputName: 'userProfile', aliasName: 'user' }],
    });
  }
}
