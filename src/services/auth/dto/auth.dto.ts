import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoles } from '../../service.constants';

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
