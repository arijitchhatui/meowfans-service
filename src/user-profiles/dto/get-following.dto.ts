import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetFollowingInput {
  @Field()
  offset: number;
}
