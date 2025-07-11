import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AssetsRepository, CreatorAssetsRepository, PostAssetsRepository } from 'src/rdb/repositories';
import { UploadsService } from 'src/uploads/uploads.service';
import { DeleteCreatorAsset } from './dto';

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
        buffer: file.buffer,
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
      type: file.mimetype,
      creatorId: creatorId,
    });

    const [savedAsset] = await Promise.all([
      await this.assetsRepository.save(asset),
      await this.creatorAssetsRepository.save({ assetId: asset.id, creatorId: creatorId }),
    ]);

    return await this.assetsRepository.save(savedAsset);
  }

  public async deleteCreatorAsset(creatorId: string, input: DeleteCreatorAsset) {
    const result = await this.creatorAssetsRepository.delete({ creatorId, assetId: input.assetId });
    return !!result.affected;
  }
}
