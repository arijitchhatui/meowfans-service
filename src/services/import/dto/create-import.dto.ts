import { DocumentQualityType, FileType } from '@app/enums';
import { HasSubdirectoryForBranch } from '@app/validators';
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, Validate } from 'class-validator';

registerEnumType(DocumentQualityType, { name: 'DocumentQualityType' });
@InputType()
export class CreateImportInput {
  @IsNotEmpty()
  @Field(() => String)
  url: string;

  @IsNotEmpty()
  @Field({ defaultValue: false })
  @Validate(HasSubdirectoryForBranch)
  hasBranch: boolean;

  @Field(() => FileType, { defaultValue: FileType.IMAGE })
  fileType: FileType;

  @Field(() => Int, { defaultValue: 10 })
  totalContent: number;

  @Field(() => DocumentQualityType, { defaultValue: DocumentQualityType.HIGH_DEFINITION })
  qualityType: DocumentQualityType;

  @Field(() => String, { nullable: true })
  subDirectory?: string;
}

export class CreateImportQueueInput extends CreateImportInput {
  creatorId: string;
}
