import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {
  @Field()
  postId: string;

  @Field()
  comment: string;
}
