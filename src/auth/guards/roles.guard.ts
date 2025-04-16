import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { RolesKey, UserRoles } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);

    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(RolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles.length) return true;

    const { user } = ctx.getContext<{ req: Request }>().req;
    if (!user?.roles) throw new ForbiddenException();

    if (user.roles.includes(UserRoles.ADMIN)) return true;

    const isOk = requiredRoles.some((role) => user.roles.includes(role));
    if (!isOk) throw new ForbiddenException();

    return isOk;
  }
}
