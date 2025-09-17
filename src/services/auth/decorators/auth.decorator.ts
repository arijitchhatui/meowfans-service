import { applyDecorators, Type, UseGuards } from '@nestjs/common';
import { IAuthGuard } from '@nestjs/passport';
import { UserRoles } from 'libs/enums/user-roles';
import { RolesGuard } from '../guards';
import { Roles } from './roles.decorator';

export function Auth(authGuard: Type<IAuthGuard>, roles: UserRoles[]): MethodDecorator & ClassDecorator {
  return applyDecorators(Roles(roles), UseGuards(authGuard, RolesGuard));
}
