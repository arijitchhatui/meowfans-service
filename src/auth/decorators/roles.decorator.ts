import { CustomDecorator, SetMetadata } from '@nestjs/common';

export enum UserRoles {
  FAN = 'fan',
  ADMIN = 'admin',
  VIEWER = 'viewer',
  CREATOR = 'creator',
}

export const RolesKey = 'roles';

export const Roles = (roles: UserRoles[]): CustomDecorator<string> => SetMetadata(RolesKey, roles);
