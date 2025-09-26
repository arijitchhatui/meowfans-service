import { PaginationInput } from '@app/helpers';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Raw, Repository } from 'typeorm';
import { UserRoles } from '../../../util/enums';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  private logger = new Logger(UsersRepository.name);

  constructor(@Optional() _target: EntityTarget<UsersEntity>, entityManager: EntityManager) {
    super(UsersEntity, entityManager);
  }

  public async isCreator(creatorId: string): Promise<boolean> {
    return this.exists({
      where: { roles: Raw((alias) => `{${UserRoles.CREATOR.toUpperCase()}} = ANY(${alias})`), id: creatorId },
    });
  }

  public async isFan(fanId: string): Promise<boolean> {
    return this.exists({
      where: { roles: Raw((alias) => `'{${UserRoles.FAN.toUpperCase()}}' = ANY(${alias})`), id: fanId },
    });
  }

  public async isAdmin(adminId: string): Promise<boolean> {
    return this.createQueryBuilder('user')
      .where('user.roles && :roles', { roles: [UserRoles.ADMIN] })
      .andWhere('user.id =:userId', { userId: adminId })
      .getExists();
  }

  public async deleteUser(userId: string) {
    await this.findOneOrFail({ where: { id: userId } });
    const result = await this.delete({ id: userId });
    return !!result.affected;
  }

  public async getAllCreators(input: PaginationInput) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.creatorProfile', 'creator')
      .andWhere('user.roles && :roles', { roles: [input.role] })
      .limit(input.limit)
      .offset(input.offset)
      .orderBy('user.createdAt', input.orderBy)
      .getManyAndCount();
  }
}
