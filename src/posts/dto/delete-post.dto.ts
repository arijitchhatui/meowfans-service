import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class DeletePostInput {
  @Field()
  @Column()
  postId: string;
}
