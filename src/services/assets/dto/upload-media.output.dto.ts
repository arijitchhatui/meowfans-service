import { FileType, MediaType } from '@app/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaOutput {
  @ApiProperty({ nullable: false, default: 'string' })
  rawUrl: string;

  @ApiProperty({ nullable: false, default: 'string' })
  blurredUrl: string;

  @ApiProperty({ nullable: false })
  mimeType: string;

  @ApiProperty({ nullable: false })
  mediaType: MediaType;

  @ApiProperty({ nullable: false })
  fileType: FileType;

  @ApiProperty({ nullable: false })
  assetId?: string;
}
