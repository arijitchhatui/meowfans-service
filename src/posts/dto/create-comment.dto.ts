import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreateCommentInput {
  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  comment: string;
}
