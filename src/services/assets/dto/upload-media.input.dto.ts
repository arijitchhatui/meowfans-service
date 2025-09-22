import { IsEnum } from 'class-validator';
import { AssetType, MediaType } from '../../../util/enums';

export class UploadMediaInput {
  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsEnum(AssetType)
  assetType: AssetType;
}
