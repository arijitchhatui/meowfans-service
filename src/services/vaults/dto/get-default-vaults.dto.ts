import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VaultsEntity } from '../../postgres/entities';

@ObjectType()
export class GetDefaultVaultsOutput {
  @Field(() => [VaultsEntity])
  vaults: VaultsEntity[];

  @Field(() => Int, { nullable: true })
  count?: number;

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Boolean, { nullable: true })
  hasPrev?: boolean;

  @Field(() => Boolean, { nullable: true })
  hasNext?: boolean;
}
