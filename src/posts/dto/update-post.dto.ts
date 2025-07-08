import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class UpdatePostInput {
  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  caption: string;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column()
  isExclusive: boolean;
}
