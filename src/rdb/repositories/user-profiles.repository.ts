import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { UserProfilesEntity } from '../entities';

@Injectable()
export class UserProfilesRepository extends Repository<UserProfilesEntity> {
  private logger = new Logger(UserProfilesRepository.name);

  constructor(@Optional() _target: EntityTarget<UserProfilesEntity>, entityManager: EntityManager) {
    super(UserProfilesEntity, entityManager);
  }
}
