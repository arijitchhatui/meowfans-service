import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, Validate } from 'class-validator';
import { HasAssetsForExclusivePropValidator } from '../../../lib';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  caption: string;

  @Field(() => Boolean)
  @IsBoolean()
  @Validate(HasAssetsForExclusivePropValidator)
  isExclusive: boolean;

  @Field(() => Int, { nullable: true })
  unlockPrice: number;

  @Field(() => [String])
  creatorAssetIds: string[];
}
