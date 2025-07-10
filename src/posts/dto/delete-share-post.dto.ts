import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class DeleteSharePostInput {
  @Field()
  @Column()
  shareId: string;

  @Field()
  @Column()
  postId: string;
}
