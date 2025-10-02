import { Field, InputType } from '@nestjs/graphql';
import { ContentType } from '../../../util/enums';
import { ImportTypes } from '../../../util/enums/import-types';

@InputType()
export class BulkInsertVaultInput {
  @Field(() => [String])
  objects: string[];

  @Field(() => String)
  baseUrl: string;

  @Field(() => ContentType, { defaultValue: ContentType.SFW, nullable: true })
  contentType: ContentType;

  @Field(() => ImportTypes, { nullable: true })
  importType: ImportTypes;
}
