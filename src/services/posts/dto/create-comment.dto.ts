import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { ProfanityValidator } from '@app/validators';

@InputType()
export class CreateCommentInput {
  @Field()
  postId: string;

  @Field()
  @Validate(ProfanityValidator)
  comment: string;
}
