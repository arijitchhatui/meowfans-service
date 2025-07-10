import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class UpdateCommentInput {
  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  comment: string;
}
