import { Field, ObjectType } from '@nestjs/graphql';
import { CreatorRestrictsEntity } from '../../postgres/entities';

@ObjectType()
export class GetRestrictedUsersOutput extends CreatorRestrictsEntity {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;
}
