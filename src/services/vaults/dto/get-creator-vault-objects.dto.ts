import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VaultObjectsEntity } from '../../postgres/entities';

@ObjectType()
export class GetCreatorVaultObjectsOutput {
  @Field(() => [VaultObjectsEntity])
  vaultObjects: VaultObjectsEntity[];

  @Field(() => Int)
  count: number;
}
