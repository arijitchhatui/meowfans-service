import { HasSubdirectoryForBranch } from '@app/validators';
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, Validate } from 'class-validator';
import { DocumentQualityType, FileType } from '../../service.constants';

registerEnumType(DocumentQualityType, { name: 'DocumentQualityType' });
@InputType()
export class CreateScrapeInput {
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

export class CreateScrapeQueueInput extends CreateScrapeInput {
  creatorId: string;
}
