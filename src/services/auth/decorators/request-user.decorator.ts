import { applyDecorators, createParamDecorator, ExecutionContext, UseInterceptors } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtUser } from '..';
import { RequestUserInterceptor } from '../interceptors/inject-session.interceptor';

export function RequestUser(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseInterceptors(RequestUserInterceptor));
}

export const RequestUserParam = createParamDecorator((_: unknown, context: ExecutionContext): Partial<JwtUser> => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext<{ req: Request }>().req;

  return { ip: req.ip, userAgent: req.headers['user-agent'] };
});
