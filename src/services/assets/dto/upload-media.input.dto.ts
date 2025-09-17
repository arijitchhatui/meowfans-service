import { MediaType } from '@app/enums';
import { IsEnum } from 'class-validator';

export class UploadMediaInput {
  @IsEnum(MediaType)
  mediaType: MediaType;
}
