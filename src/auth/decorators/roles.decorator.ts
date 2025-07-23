import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../util';

export { UserRoles };

export const RolesKey = 'roles';

export const Roles = (roles: UserRoles[]): CustomDecorator<string> => SetMetadata(RolesKey, roles);
