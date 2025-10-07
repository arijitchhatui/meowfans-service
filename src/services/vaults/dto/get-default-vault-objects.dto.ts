import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VaultObjectsEntity, VaultsEntity } from '../../postgres/entities';

@ObjectType()
export class GetDefaultVaultObjectsOutput {
  @Field(() => [VaultObjectsEntity], { defaultValue: [] })
  vaultObjects: VaultObjectsEntity[];

  @Field(() => VaultsEntity)
  vault: VaultsEntity;

  @Field(() => Int, { defaultValue: 0 })
  count: number;

  @Field(() => Int, { defaultValue: 0 })
  totalPages: number;

  @Field(() => Boolean, { defaultValue: false })
  hasPrev: boolean;

  @Field(() => Boolean, { defaultValue: false })
  hasNext: boolean;
}
