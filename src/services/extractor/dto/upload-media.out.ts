import { Field, ObjectType } from '@nestjs/graphql';
import { FileType, MediaType } from '../../../util/enums';

@ObjectType()
export class UploadMediaOutput {
  @Field({ nullable: false, defaultValue: 'string' })
  rawUrl: string;

  @Field({ nullable: false, defaultValue: 'string' })
  blurredUrl: string;

  @Field({ nullable: false })
  mimeType: string;

  @Field({ nullable: false })
  mediaType: MediaType;

  @Field({ nullable: false })
  fileType: FileType;

  @Field({ nullable: false })
  assetId?: string;
}
