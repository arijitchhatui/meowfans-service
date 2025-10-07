import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePreviewOfVaultsInput {
  @Field(() => String)
  adminId: string;
}
