import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class SharePostInput {
  @Field()
  @Column()
  postId: string;
}
