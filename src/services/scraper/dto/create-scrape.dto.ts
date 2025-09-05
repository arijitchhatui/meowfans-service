import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { DocumentQualityType, FileType } from '../../service.constants';

registerEnumType(DocumentQualityType, { name: 'DocumentQualityType' });
@InputType()
export class CreateScrapeInput {
  @IsNotEmpty()
  @Field(() => String)
  url: string;

  @IsNotEmpty()
  @Field({ defaultValue: false })
  hasBranch: boolean;

  @Field(() => FileType, { defaultValue: FileType.IMAGE })
  mediaType: FileType;

  @Field(() => Number, { defaultValue: 10 })
  totalContent: number;

  @Field(() => DocumentQualityType, { defaultValue: DocumentQualityType.LOW_DEFINITION })
  qualityType: DocumentQualityType;
}

export class CreateScrapeQueueInput extends CreateScrapeInput {
  creatorId: string;
}
