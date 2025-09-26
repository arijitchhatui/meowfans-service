import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VaultObjectsEntity } from '../../postgres/entities';

@ObjectType()
export class GetAllVaultsOutput {
  @Field(() => [VaultObjectsEntity])
  vaults: VaultObjectsEntity[];

  @Field(() => Int)
  count: number;
}
