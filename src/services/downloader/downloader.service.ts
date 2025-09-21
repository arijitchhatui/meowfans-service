import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { request } from 'undici';
import { MediaType, QueueTypes } from '../../util/enums';
import { AssetsService } from '../assets';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { VaultsObjectsRepository } from '../postgres/repositories';
import { headerPools } from '../service.constants';
import { UploadVaultInput, UploadVaultQueueInput } from './dto';

@Injectable()
export class DownloaderService {
  private logger = new Logger(DownloaderService.name);
  constructor(
    @InjectQueue(QueueTypes.UPLOAD_VAULT_QUEUE)
    private uploadVaultQueue: Queue<UploadVaultQueueInput>,
    private vaultObjectsRepository: VaultsObjectsRepository,
    private documentSelectorService: DocumentSelectorService,
    private assetsService: AssetsService,
  ) {}

  public async fetch(downloadUrl: string, baseUrl: string): Promise<Buffer | null> {
    this.logger.log('PROCESSING REQUEST THROUGH UNDICI 🚀🚀🚀🚀');
    this.logger.log({ downloadUrl, baseUrl });

    try {
      const { body, statusCode } = await request(downloadUrl, {
        method: 'GET',
        headers: this.getRandomHeaders(baseUrl),
      });

      if (statusCode !== 200) {
        this.logger.error(`Undici fetch failed with status: ${statusCode}`);
        return null;
      }

      const buffer = Buffer.from(await body.arrayBuffer());
      this.logger.log(`✅ GOT THE DATA: ${buffer.length} bytes`);
      return buffer;
    } catch (err) {
      this.logger.error('❌ Undici fetch error', err);
      return null;
    }
  }

  public async uploadVault(creatorId: string, input: UploadVaultInput) {
    this.logger.log({ creatorId, ...input });
    await this.uploadVaultQueue.add({ creatorId, ...input });
    return 'Job added';
  }

  public async handleUpload(input: UploadVaultQueueInput) {
    const { vaultObjectIds, creatorId } = input;
    if (!vaultObjectIds.length) return;

    for (const vaultObjectId of vaultObjectIds) {
      const vaultObject = await this.vaultObjectsRepository.findOneOrFail({
        where: { id: vaultObjectId },
        relations: { vault: true },
      });

      try {
        const buffer = await this.fetch(vaultObject.objectUrl, vaultObject.vault.url);
        const mimeType = this.documentSelectorService.resolveMimeType(vaultObject.objectUrl);

        if (!buffer) throw new Error('UNDICI ERROR :: RETURNING');

        await this.assetsService.uploadFileV2(
          creatorId,
          vaultObject.objectUrl,
          MediaType.PROFILE_MEDIA,
          buffer,
          mimeType,
        );

        await this.vaultObjectsRepository.updateStatusToFulfilledState(vaultObject.objectUrl);

        this.logger.log(`✅ DOWNLOADED & UPLOADED: ${vaultObject.objectUrl}`);
        return await this.vaultObjectsRepository.findOneOrFail({
          where: { id: vaultObjectId },
          relations: { vault: true },
        });
      } catch (err) {
        this.logger.error('❌ FAILED TO SAVE!', vaultObject.objectUrl, err?.message);
        return await this.vaultObjectsRepository.findOneOrFail({
          where: { id: vaultObjectId },
          relations: { vault: true },
        });
      }
    }
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
