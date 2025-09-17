import { PostTypes } from '@app/enums';
import { HasAssetsForExclusivePropValidator, ProfanityValidator } from '@app/validators';
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsUUID, Validate } from 'class-validator';

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
