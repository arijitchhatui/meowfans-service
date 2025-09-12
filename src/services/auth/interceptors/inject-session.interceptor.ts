import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { SessionsRepository } from 'src/services/postgres/repositories';

@Injectable()
export class RequestUserInterceptor implements NestInterceptor {
  constructor(private sessionsRepository: SessionsRepository) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const { ip, headers, user } = context.switchToHttp().getRequest<Request>();
    const userId = user?.sub;
    const userAgent = headers['user-agent'];
    if (ip && userId && userAgent) await this.sessionsRepository.createSession({ ip: ip, userId: userId, userAgent });
    return next.handle();
  }
}
