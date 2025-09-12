import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsUUID, Validate } from 'class-validator';
import { HasAssetsForExclusivePropValidator, ProfanityValidator } from '@app/validators';
import { PostTypes } from '../../service.constants';

registerEnumType(PostTypes, { name: 'PostTypes' });
@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  @Validate(ProfanityValidator)
  caption: string;

  @Field(() => Int, { nullable: true })
  unlockPrice: number;

  @IsUUID('all', { each: true })
  @Field(() => [String])
  assetIds: string[];

  @Validate(HasAssetsForExclusivePropValidator)
  @Field(() => [PostTypes])
  types: PostTypes[];
}
