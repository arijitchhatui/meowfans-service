import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { AssetsRepository, CreatorAssetsRepository, PostAssetsRepository } from '../rdb/repositories';
import { UploadsService } from '../uploads';
import { DeleteCreatorAsset, GetCreatorAssetsInput } from './dto';
import { CreateAssetInput } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  public constructor(
    private creatorAssetsRepository: CreatorAssetsRepository,
    private postAssetsRepository: PostAssetsRepository,
    private assetsRepository: AssetsRepository,
    private uploadsService: UploadsService,
  ) {}

  public async insertAsset(creatorId: string, file: { buffer: Buffer; originalname: string; mimetype: string }) {
    const path = `assets/${creatorId}/${randomUUID()}/${file.originalname}`;

    const blurredBuffer = await sharp(file.buffer)
      .blur(20)
      .resize(200, 200, { fit: sharp.fit.inside, withoutEnlargement: true })
      .toFormat('webp')
      .toBuffer();

    const [raw, blur] = await Promise.all([
      this.uploadsService.uploadImage({
        buffer: file.buffer,
        contentType: file.mimetype,
        metaData: {
          mimeType: file.mimetype,
          originalName: file.originalname,
        },
        path,
      }),
      this.uploadsService.uploadImage({
        buffer: blurredBuffer,
        contentType: file.mimetype,
        metaData: {
          mimeType: file.mimetype,
          originalName: file.originalname,
        },
        path,
      }),
    ]);

    const asset = this.assetsRepository.create({
      blurredUrl: blur.url,
      contentType: file.mimetype,
      isVideo: file.mimetype === 'video/mp4' ? true : false,
      mimeType: file.mimetype,
      rawUrl: raw.url,
      creatorId: creatorId,
    });

    const [savedAsset] = await Promise.all([
      await this.assetsRepository.save(asset),
      await this.creatorAssetsRepository.save({ assetId: asset.id, creatorId: creatorId }),
    ]);

    return await this.assetsRepository.save(savedAsset);
  }

  public async createAsset(creatorId: string, input: CreateAssetInput) {
    const asset = await this.assetsRepository.save({
      blurredUrl: input.blurredUrl,
      rawUrl: input.rawUrl,
      contentType: input.contentType,
      creatorId: creatorId,
      mimeType: input.mimeType,
      isVideo: input.isVideo,
    });
    await this.creatorAssetsRepository.save({ assetId: asset.id, creatorId: creatorId });
    return await this.assetsRepository.save(asset);
  }

  public async getCreatorAssets(creatorId: string, input: GetCreatorAssetsInput) {
    return await this.creatorAssetsRepository.getCreatorAssets(creatorId, input);
  }

  public async deleteCreatorAsset(creatorId: string, input: DeleteCreatorAsset) {
    const result = await this.creatorAssetsRepository.delete({ creatorId, assetId: input.assetId });
    return !!result.affected;
  }
}
