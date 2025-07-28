import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetPostsInfoInput {
  @Field(() => Int)
  offset: number;
}
