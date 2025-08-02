import { Field, ObjectType } from '@nestjs/graphql';
import { FanProfileOutput } from '../../../lib/helpers';

@ObjectType()
export class GetFollowedUsersOutput {
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

  @Field(() => FanProfileOutput)
  fanProfile: FanProfileOutput;
}
