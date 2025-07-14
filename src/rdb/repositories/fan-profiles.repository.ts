import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { FanProfilesEntity } from '../entities';

@Injectable()
export class FanProfilesRepository extends Repository<FanProfilesEntity> {
  private logger = new Logger(FanProfilesRepository.name);

  constructor(@Optional() _target: EntityTarget<FanProfilesEntity>, entityManager: EntityManager) {
    super(FanProfilesEntity, entityManager);
  }
}
