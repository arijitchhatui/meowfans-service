import { FileType, MediaType } from '@app/enums';
import { Field, ObjectType } from '@nestjs/graphql';

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
