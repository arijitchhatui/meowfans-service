import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsUUID, Validate } from 'class-validator';
import { HasAssetsForExclusivePropValidator } from '../../../lib';
import { PostTypes } from '../../service.constants';

registerEnumType(PostTypes, { name: 'PostTypes' });
@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  caption: string;

  @Field(() => Int, { nullable: true })
  unlockPrice: number;

  @IsUUID('all', { each: true })
  @Field(() => [String])
  creatorAssetIds: string[];

  @Validate(HasAssetsForExclusivePropValidator)
  @Field(() => [PostTypes])
  types: PostTypes[];
}
