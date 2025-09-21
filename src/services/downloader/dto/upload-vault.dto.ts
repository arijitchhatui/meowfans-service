import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UploadVaultInput {
  @Field(() => [ID])
  vaultObjectIds: string[];
}

export class UploadVaultQueueInput extends UploadVaultInput {
  creatorId: string;
}
