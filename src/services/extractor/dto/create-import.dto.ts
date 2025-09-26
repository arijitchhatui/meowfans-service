import { HasSubdirectoryForBranch } from '@app/validators';
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, Validate } from 'class-validator';
import { DocumentQualityType, FileType } from '../../../util/enums';
import { ImportTypes } from '../../../util/enums/import-types';

registerEnumType(DocumentQualityType, { name: 'DocumentQualityType' });
registerEnumType(ImportTypes, { name: 'ImportTypes' });
@InputType()
export class CreateImportInput {
  @IsNotEmpty()
  @Field(() => String)
  url: string;

  @Field(() => FileType, { defaultValue: FileType.IMAGE })
  fileType: FileType;

  @Field(() => Int, { defaultValue: 10 })
  totalContent: number;

  @Field(() => ImportTypes, { defaultValue: ImportTypes.PROFILE })
  importType: ImportTypes;

  @Field(() => DocumentQualityType, { defaultValue: DocumentQualityType.HIGH_DEFINITION })
  qualityType: DocumentQualityType;

  @Validate(HasSubdirectoryForBranch)
  @Field(() => String, { nullable: false })
  subDirectory: string;

  @Field(() => Int, { defaultValue: 0 })
  start: number;

  @Field(() => Int, { defaultValue: 0 })
  exclude: number;

  @Field(() => [String], { nullable: true })
  exceptions: string[];
}

@InputType()
export class CreateImportQueueInput extends CreateImportInput {
  @Field(() => String)
  creatorId: string;
}
