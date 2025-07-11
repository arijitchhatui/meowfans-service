import { Field, ID, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreatePostInput {
  @Field()
  @Column()
  caption: string;

  @Field()
  @Column()
  isExclusive: boolean;

  @Field()
  @Column()
  unlockPrice: number;

  @Field(() => [ID])
  @Column()
  assetIds: string[];
}
