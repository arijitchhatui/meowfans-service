import { Optional, UnauthorizedException } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { SessionsEntity, UsersEntity } from '../entities';

export class SessionsRepository extends Repository<SessionsEntity> {
  constructor(@Optional() _target: EntityTarget<SessionsEntity>, entityManager: EntityManager) {
    super(SessionsEntity, entityManager);
  }

  public async createSession(input: { ip?: string; user?: UsersEntity; userAgent?: string; userId: string }) {
    const { ip, userId, userAgent } = input;

    const newSession = this.create({
      ip,
      userId,
      userAgent,
    });

    return await this.save(newSession);
  }

  private async validateSession(input: { user: UsersEntity; userAgent: string; userId: string }) {
    const { userId, userAgent } = input;
    const session = await this.findOne({ where: { userId: userId, userAgent: userAgent } });

    if (!session) throw new UnauthorizedException({ message: 'New IP Address detected' });
  }
}
