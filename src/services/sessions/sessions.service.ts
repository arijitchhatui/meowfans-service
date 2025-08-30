import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../postgres/entities';
import { SessionsRepository } from '../postgres/repositories';

export interface SessionInput {
  userId: string;
  user?: UsersEntity;
  ip: string;
  userAgent: string;
}

@Injectable()
export class SessionsService {
  constructor(private sessionsRepository: SessionsRepository) {}
}
