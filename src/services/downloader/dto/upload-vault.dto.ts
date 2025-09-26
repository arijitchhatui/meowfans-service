import { Field, ID, InputType } from '@nestjs/graphql';
import { AssetType } from '../../../util/enums';

@InputType()
export class UploadVaultInput {
  @Field(() => [ID])
  vaultObjectIds: string[];

  @Field(() => AssetType, { defaultValue: AssetType.PRIVATE })
  destination: AssetType;
}

@InputType()
export class UploadVaultQueueInput extends UploadVaultInput {
  @Field(() => String)
  creatorId: string;
}
