import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { SocialAccountsEntity } from '../entities';

@Injectable()
export class SocialAccountsRepository extends Repository<SocialAccountsEntity> {
  private logger = new Logger(SocialAccountsEntity.name);

  constructor(@Optional() _target: EntityTarget<SocialAccountsEntity>, entityManager: EntityManager) {
    super(SocialAccountsEntity, entityManager);
  }
}
