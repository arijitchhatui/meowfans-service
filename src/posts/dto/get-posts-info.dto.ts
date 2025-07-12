import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetPostsInfoInput {
  @Field()
  offset: number;
}
