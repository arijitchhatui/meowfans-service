import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class LikePostInput {
  @Field()
  @Column()
  postId: string;
}
