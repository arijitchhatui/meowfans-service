import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PasswordsEntity } from '../entities';

@Injectable()
export class PasswordsRepository extends Repository<PasswordsEntity> {
  constructor(@Optional() _target: EntityTarget<PasswordsEntity>, entityManager: EntityManager) {
    super(PasswordsEntity, entityManager);
  }
}
