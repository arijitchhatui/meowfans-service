import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  private logger = new Logger(UsersRepository.name);

  constructor(@Optional() _target: EntityTarget<UsersEntity>, entityManager: EntityManager) {
    super(UsersEntity, entityManager);
  }
}
