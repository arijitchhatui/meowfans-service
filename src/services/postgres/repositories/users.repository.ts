import { Injectable, Logger, Optional } from '@nestjs/common';
import { UserRoles } from 'libs/enums/user-roles';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  private logger = new Logger(UsersRepository.name);

  constructor(@Optional() _target: EntityTarget<UsersEntity>, entityManager: EntityManager) {
    super(UsersEntity, entityManager);
  }

  public async isCreator(creatorId: string): Promise<boolean> {
    return this.exists({ where: { roles: UserRoles.CREATOR, id: creatorId } });
  }

  public async isFan(fanId: string): Promise<boolean> {
    return this.exists({ where: { roles: UserRoles.FAN, id: fanId } });
  }

  public async isAdmin(adminId: string): Promise<boolean> {
    return this.exists({ where: { roles: UserRoles.ADMIN, id: adminId } });
  }
}
