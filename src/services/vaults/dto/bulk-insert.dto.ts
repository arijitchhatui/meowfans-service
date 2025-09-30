import { Field, InputType } from '@nestjs/graphql';
import { ContentType } from '../../../util/enums';

@InputType()
export class BulkInsertVaultInput {
  @Field(() => [String])
  objects: string[];

  @Field(() => String)
  baseUrl: string;

  @Field(() => ContentType, { defaultValue: ContentType.SFW, nullable: true })
  contentType: ContentType;
}
