import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  caption: string;

  @Field(() => Boolean)
  isExclusive: boolean;

  @Field(() => Int)
  unlockPrice: number;

  @Field(() => [ID])
  creatorAssetIds: string[];
}
