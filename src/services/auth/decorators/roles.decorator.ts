import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRoles } from 'libs/enums/user-roles';

export const RolesKey = 'roles';

export const Roles = (roles: UserRoles[]): CustomDecorator<string> => SetMetadata(RolesKey, roles);
