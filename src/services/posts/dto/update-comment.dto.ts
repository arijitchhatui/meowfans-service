import { ProfanityValidator } from '@app/validators';
import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @Field()
  postId: string;

  @Field()
  @Validate(ProfanityValidator)
  comment: string;

  @Field()
  commentId: string;
}
