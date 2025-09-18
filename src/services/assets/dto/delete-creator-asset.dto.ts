import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCreatorAsset {
  @Field(() => [ID])
  assetIds: string[];
}
