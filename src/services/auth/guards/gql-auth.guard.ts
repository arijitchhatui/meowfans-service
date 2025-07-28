import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthGuardStrategyMapping } from '../constants';

@Injectable()
export class GqlAuthGuard extends AuthGuard(AuthGuardStrategyMapping.JWT) {
  public getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: Request }>().req;
  }
}
