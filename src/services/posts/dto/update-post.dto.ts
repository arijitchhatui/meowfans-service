import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { HasAssetsForExclusivePropValidator } from '../../../lib';

@InputType()
export class UpdatePostInput {
  @Field()
  postId: string;

  @Field({ nullable: true })
  caption: string;

  @Field({ nullable: true })
  unlockPrice: number;

  @Field({ nullable: true })
  @Validate(HasAssetsForExclusivePropValidator)
  isExclusive: boolean;
}
