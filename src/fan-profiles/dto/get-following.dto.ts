import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetFollowingInput {
  @Field(() => Int)
  offset: number;
}
