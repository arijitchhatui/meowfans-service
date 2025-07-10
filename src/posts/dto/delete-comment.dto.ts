import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class DeleteCommentInput {
  @Field()
  @Column()
  postId: string;
}
