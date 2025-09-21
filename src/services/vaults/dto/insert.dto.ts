import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class InsertVaultInput {
  @Field(() => [String])
  urls: string[];
}
