import { ApiProperty } from '@nestjs/swagger';
import { FileType, MediaType } from '../../../util/enums';

export class UploadMediaOutput {
  @ApiProperty({ nullable: false, default: 'string' })
  rawUrl: string;

  @ApiProperty({ nullable: false, default: 'string' })
  blurredUrl: string | null;

  @ApiProperty({ nullable: false })
  mimeType: string;

  @ApiProperty({ nullable: false })
  mediaType: MediaType;

  @ApiProperty({ nullable: false })
  fileType: FileType;

  @ApiProperty({ nullable: false })
  assetId?: string;
}
