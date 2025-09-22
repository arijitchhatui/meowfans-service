import { Field, ID, InputType } from '@nestjs/graphql';
import { AssetType } from '../../../util/enums';

@InputType()
export class UpdateAssetsInput {
  @Field(() => [ID])
  assetIds: string[];

  @Field(() => AssetType, { nullable: false })
  assetType: AssetType;
}
