import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class SavePostInput {
  @Field()
  @Column()
  postId: string;
}
