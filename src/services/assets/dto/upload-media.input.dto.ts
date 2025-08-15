import { IsEnum } from 'class-validator';
import { MediaType } from '../../service.constants';

export class UploadMediaInput {
  @IsEnum(MediaType)
  mediaType: MediaType;
}
