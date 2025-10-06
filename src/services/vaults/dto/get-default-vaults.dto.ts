import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VaultsEntity } from '../../postgres/entities';

@ObjectType()
export class GetDefaultVaultsOutput {
  @Field(() => [VaultsEntity])
  vaults: VaultsEntity[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Boolean)
  hasPrev: boolean;

  @Field(() => Boolean)
  hasNext: boolean;
}
