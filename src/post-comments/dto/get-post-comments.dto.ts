import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetPostCommentsInput {
  @Field(() => Int)
  offset: number;

  @Field()
  postId: string;
}
