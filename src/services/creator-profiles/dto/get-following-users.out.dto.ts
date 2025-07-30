import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatorProfileOutput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;
}

@ObjectType()
export class GetFollowingUsersOutput {
  @Field()
  id: string;

  @Field()
  fanId: string;

  @Field()
  creatorId: string;

  @Field()
  followedAt: Date;

  @Field({ nullable: true })
  unFollowedAt: Date;

  @Field(() => CreatorProfileOutput)
  creatorProfile: CreatorProfileOutput;
}
