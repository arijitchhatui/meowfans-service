import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BulkInsertVaultInput {
  @Field(() => [String])
  objects: string[];

  @Field(() => String)
  baseUrl: string;
}
