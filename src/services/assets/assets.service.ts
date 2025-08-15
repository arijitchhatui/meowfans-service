import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import { PaginationInput } from '../../lib/helpers';
import { AssetsEntity } from '../rdb/entities';
import { AssetsRepository, CreatorAssetsRepository, CreatorProfilesRepository } from '../rdb/repositories';
import { FileType, ImageType, MediaType } from '../service.constants';
import { UploadsService } from '../uploads';
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
    private uploadsService: UploadsService,
  ) {}

  public async getCreatorAssets(creatorId: string, input: PaginationInput) {
    return await this.creatorAssetsRepository.getCreatorAssets(creatorId, input);
  }

  public async deleteCreatorAsset(creatorId: string, input: DeleteCreatorAsset) {
    const result = await this.creatorAssetsRepository.delete({ creatorId, assetId: input.assetId });
    return !!result.affected;
  }

  public async uploadFile(
    creatorId: string,
    file: Express.Multer.File,
    mediaType: MediaType,
  ): Promise<UploadMediaOutput> {
    const uploaded = await this.handleUpload(creatorId, mediaType, file);

    const asset = await this.injectAsset(creatorId, uploaded);

    const result = { ...uploaded, assetId: asset.id };

    return result;
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
    return await this.uploadImageToCloud(creatorId, mediaType, file);
  }

  private async uploadImageToCloud(
    creatorId: string,
    mediaType: MediaType,
    file: Express.Multer.File,
  ): Promise<UploadMediaOutput> {
    const [rawImageBuffer, blurredImageBuffer] = await Promise.all([
      this.convertImage(file).toBuffer(),
      this.blurImage(file).toBuffer(),
    ]);

    const [originalUrl, blurredUrl] = await Promise.all([
      this.uploadsService.uploadImage({
        buffer: rawImageBuffer,
        file: file,
        imageType: ImageType.ORIGINAL,
        mediaType: mediaType,
        userId: creatorId,

        metaData: { originalName: file.originalname },
      }),
      this.uploadsService.uploadImage({
        buffer: blurredImageBuffer,
        file: file,
        imageType: ImageType.BLURRED,
        mediaType: mediaType,
        userId: creatorId,
        metaData: { originalName: file.originalname },
      }),
    ]);

    const payLoad = {
      rawUrl: originalUrl,
      blurredUrl: blurredUrl,
      mimeType: file.mimetype,
      mediaType: mediaType,
      fileType: FileType.IMAGE,
    };

    return payLoad;
  }

  private async injectAsset(creatorId: string, assetPayload: UploadMediaOutput): Promise<AssetsEntity> {
    const creatorProfile = await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId } });

    const asset = this.assetsRepository.create({ ...assetPayload, creatorProfile });

    const [newAsset] = await Promise.all([
      await this.assetsRepository.save(asset),
      await this.creatorAssetsRepository.insert({ creatorProfile, asset }),
    ]);

    return newAsset;
  }

  private convertImage(file: Express.Multer.File) {
    return sharp(file.buffer).rotate().webp({ quality: 100 });
  }

  private blurImage(file: Express.Multer.File) {
    return sharp(file.buffer)
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
