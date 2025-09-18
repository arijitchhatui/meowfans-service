import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../../util/enums';

export const RolesKey = 'roles';

export const Roles = (roles: UserRoles[]): CustomDecorator<string> => SetMetadata(RolesKey, roles);
