import { IsEnum } from 'class-validator';
import { MediaType } from '../../../util/enums';

export class UploadMediaInput {
  @IsEnum(MediaType)
  mediaType: MediaType;
}
