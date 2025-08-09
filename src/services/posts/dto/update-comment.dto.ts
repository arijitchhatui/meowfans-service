import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { ProfanityValidator } from '../../../lib';

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
