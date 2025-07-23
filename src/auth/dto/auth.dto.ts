import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoles } from '../decorators';

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
