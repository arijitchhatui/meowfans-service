import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { MessageChannelParticipantsEntity } from '../entities';

@Injectable()
export class MessageChannelParticipantsRepository extends Repository<MessageChannelParticipantsEntity> {
  private logger = new Logger(MessageChannelParticipantsEntity.name);

  public constructor(
    @Optional() _target: EntityTarget<MessageChannelParticipantsEntity>,
    entityManager: EntityManager,
  ) {
    super(MessageChannelParticipantsEntity, entityManager);
  }
}
