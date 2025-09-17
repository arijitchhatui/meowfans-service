import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoles } from 'libs/enums/user-roles';

@ObjectType()
export class AuthOk {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => [UserRoles])
  roles: UserRoles[];
}
