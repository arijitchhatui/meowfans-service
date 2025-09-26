import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CreatorAssetsEntity } from '../../postgres/entities';

@ObjectType()
export class GetAllAssetsOutput {
  @Field(() => [CreatorAssetsEntity])
  assets: CreatorAssetsEntity[];

  @Field(() => Int)
  count: number;
}
