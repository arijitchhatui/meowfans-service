import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, Validate } from 'class-validator';
import { HasAssetsForExclusivePropValidator } from '../../../lib';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  caption: string;

  @Field(() => Boolean)
  @IsBoolean()
  isExclusive: boolean;

  @Field(() => Int, { nullable: true })
  @Validate(HasAssetsForExclusivePropValidator)
  unlockPrice: number;

  @Field(() => [String])
  @Validate(HasAssetsForExclusivePropValidator)
  creatorAssetIds: string[];
}
