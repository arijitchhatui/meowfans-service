import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetFollowersInput {
  @Field(() => Int)
  offset: number;
}
