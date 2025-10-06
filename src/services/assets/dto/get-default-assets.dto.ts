import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CreatorAssetsEntity } from '../../postgres/entities';

@ObjectType()
export class GetDefaultAssetsOutput {
  @Field(() => [CreatorAssetsEntity])
  assets: CreatorAssetsEntity[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Boolean)
  hasPrev: boolean;

  @Field(() => Boolean)
  hasNext: boolean;
}
