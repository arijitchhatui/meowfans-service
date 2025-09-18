import { applyDecorators, Type, UseGuards } from '@nestjs/common';
import { IAuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards';
import { Roles } from './roles.decorator';
import { UserRoles } from '../../../util/enums';

export function Auth(authGuard: Type<IAuthGuard>, roles: UserRoles[]): MethodDecorator & ClassDecorator {
  return applyDecorators(Roles(roles), UseGuards(authGuard, RolesGuard));
}
