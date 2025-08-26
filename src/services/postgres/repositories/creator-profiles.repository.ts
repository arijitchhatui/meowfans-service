import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { CreatorProfilesEntity } from '../entities/creator-profiles.entity';

@Injectable()
export class CreatorProfilesRepository extends Repository<CreatorProfilesEntity> {
  private logger = new Logger(CreatorProfilesRepository.name);

  constructor(@Optional() _target: EntityTarget<CreatorProfilesEntity>, entityManager: EntityManager) {
    super(CreatorProfilesEntity, entityManager);
  }
}
