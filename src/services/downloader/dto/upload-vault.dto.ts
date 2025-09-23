import { Field, ID, InputType } from '@nestjs/graphql';
import { AssetType } from '../../../util/enums';

@InputType()
export class UploadVaultInput {
  @Field(() => [ID])
  vaultObjectIds: string[];

  @Field(() => AssetType, { defaultValue: AssetType.PRIVATE })
  destination: AssetType;
}

export class UploadVaultQueueInput extends UploadVaultInput {
  creatorId: string;
}
