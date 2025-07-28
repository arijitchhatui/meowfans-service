import { Field, ObjectType } from '@nestjs/graphql';
import { CreatorFollowsEntity } from '../../rdb/entities';

@ObjectType()
export class GetFollowingUsersOutput extends CreatorFollowsEntity {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;
}
