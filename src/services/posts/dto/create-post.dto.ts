import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  caption: string;

  @Field(() => Boolean)
  @IsBoolean()
  isExclusive: boolean;

  @Field(() => Int, { nullable: true })
  unlockPrice: number;

  @Field(() => [String])
  creatorAssetIds: string[];
}
