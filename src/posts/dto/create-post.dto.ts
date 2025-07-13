import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  caption: string;

  @Field()
  isExclusive: boolean;

  @Field()
  unlockPrice: number;

  @Field(() => [ID])
  assetIds: string[];
}
