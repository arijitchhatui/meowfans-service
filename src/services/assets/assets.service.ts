import { PaginationInput } from '@app/helpers';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import { FileType, ImageType, MediaType } from '../../util/enums';
import { AwsS3ClientService } from '../aws';
import { AssetsEntity } from '../postgres/entities';
import { AssetsRepository, CreatorAssetsRepository, CreatorProfilesRepository } from '../postgres/repositories';
import { DeleteCreatorAsset } from './dto';
import { UploadMediaOutput } from './dto/upload-media.output.dto';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  private readonly blurOptions = {
    maxSize: { width: 289, height: 289 },
    resizeFit: 'cover',
    blurAmount: 15,
  } as const;

  public constructor(
    private creatorProfilesRepository: CreatorProfilesRepository,
    private creatorAssetsRepository: CreatorAssetsRepository,
    private assetsRepository: AssetsRepository,
    private uploadsService: AwsS3ClientService,
  ) {}

  public async getCreatorAssets(creatorId: string, input: PaginationInput) {
    return await this.creatorAssetsRepository.getCreatorAssets(creatorId, input);
  }

  public async deleteCreatorAssets(creatorId: string, input: DeleteCreatorAsset) {
    const deleteResult = await Promise.all(
      input.assetIds.map(async (assetId) => {
        const exists = await this.creatorAssetsRepository.findOne({
          where: { creatorId, assetId },
        });
        if (exists) {
          const result = await this.creatorAssetsRepository.delete({ creatorId, assetId });
          return !!result.affected;
        }
        return false;
      }),
    );
    return deleteResult.some((deleted) => deleted);
  }

  public async deleteAllAssets(creatorId: string) {
    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId } });
    const result = await this.creatorAssetsRepository.delete({ creatorId });
    return !!result.affected;
  }

  public async uploadFile(
    creatorId: string,
    file: Express.Multer.File,
    mediaType: MediaType,
  ): Promise<UploadMediaOutput> {
    const uploaded = await this.handleUpload(creatorId, mediaType, file);
    const asset = await this.injectAsset(creatorId, uploaded);
    return { ...uploaded, assetId: asset.id };
  }

  public async uploadFileV2(
    creatorId: string,
    originalFileName: string,
    mediaType: MediaType,
    buffer: Buffer,
    mimeType: string,
  ): Promise<UploadMediaOutput> {
    const uploaded = await this.uploadImageToCloud(creatorId, mediaType, buffer, originalFileName, mimeType);
    const asset = await this.injectAsset(creatorId, uploaded);
    return { ...uploaded, assetId: asset.id };
  }

  private getFileType(contentType: string): FileType {
    const fileType = contentType.split('/').at(0);
    if (!fileType) throw new BadRequestException('Invalid filetype provided!');

    switch (fileType) {
      case 'video':
        return FileType.VIDEO;
      case 'image':
        return FileType.IMAGE;
      case 'audio':
        return FileType.AUDIO;
      default:
        return FileType.DOCUMENT;
    }
  }

  private async handleUpload(
    creatorId: string,
    mediaType: MediaType,
    file: Express.Multer.File,
  ): Promise<UploadMediaOutput> {
    return await this.uploadImageToCloud(creatorId, mediaType, file.buffer, file.originalname, file.mimetype);
  }

  private async uploadImageToCloud(
    creatorId: string,
    mediaType: MediaType,
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<UploadMediaOutput> {
    const blurredImageBuffer = await this.blurImage(buffer).toBuffer();

    const [originalUrl, blurredUrl] = await Promise.all([
      this.uploadsService.uploadR2Object({
        buffer,
        originalFileName: originalName,
        imageType: ImageType.ORIGINAL,
        mediaType,
        mimeType,
        userId: creatorId,
        metaData: { originalName },
      }),
      this.uploadsService.uploadR2Object({
        buffer: blurredImageBuffer,
        originalFileName: originalName,
        imageType: ImageType.BLURRED,
        mediaType,
        mimeType,
        userId: creatorId,
        metaData: { originalName },
      }),
    ]);

    return {
      rawUrl: originalUrl,
      blurredUrl,
      mimeType,
      mediaType,
      fileType: FileType.IMAGE,
    };
  }

  private async injectAsset(creatorId: string, assetPayload: UploadMediaOutput): Promise<AssetsEntity> {
    const creatorProfile = await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId } });
    const asset = this.assetsRepository.create({ ...assetPayload, creatorProfile });

    const newAsset = await this.assetsRepository.save(asset);
    await this.creatorAssetsRepository.insert({ creatorProfile, asset });

    return newAsset;
  }

  private convertImage(buffer: Buffer) {
    return sharp(buffer).rotate().webp({ quality: 100 });
  }

  private blurImage(buffer: Buffer) {
    return sharp(buffer)
      .resize({
        width: this.blurOptions.maxSize.width,
        height: this.blurOptions.maxSize.height,
        fit: this.blurOptions.resizeFit,
        kernel: 'cubic',
        withoutEnlargement: false,
      })
      .modulate({ brightness: 0.55 })
      .blur(20)
      .rotate()
      .webp();
  }
}
