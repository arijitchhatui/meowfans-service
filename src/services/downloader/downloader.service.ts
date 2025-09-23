import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bull';
import { Agent } from 'https';
import { MediaType, QueueTypes } from '../../util/enums';
import { DownloadStates } from '../../util/enums/download-state';
import { AssetsService } from '../assets';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { VaultsObjectsRepository } from '../postgres/repositories';
import { headerPools } from '../service.constants';
import { UploadVaultInput, UploadVaultQueueInput } from './dto';

@Injectable()
export class DownloaderService {
  private logger = new Logger(DownloaderService.name);
  private readonly agent = new Agent({
    family: 4,
    keepAlive: true,
    maxSockets: 10,
  });
  constructor(
    @InjectQueue(QueueTypes.UPLOAD_VAULT_QUEUE)
    private uploadVaultQueue: Queue<UploadVaultQueueInput>,
    private vaultObjectsRepository: VaultsObjectsRepository,
    private documentSelectorService: DocumentSelectorService,
    private assetsService: AssetsService,
  ) {}

  onModuleInit() {
    this.uploadVaultQueue.on('active', (e) => console.log('active', e));
    this.uploadVaultQueue.on('error', (e) => console.log('error', e));
    this.uploadVaultQueue.on('failed', (e) => console.log('failed', e));
  }

  public async fetch(downloadUrl: string, baseUrl: string): Promise<Buffer | null> {
    console.log('PROCESSING REQUEST THROUGH AXIOS 🚀🚀🚀🚀');
    console.log({ downloadUrl, baseUrl });

    try {
      const data = await axios.get<Buffer<ArrayBuffer>>(downloadUrl, {
        method: 'GET',
        responseType: 'arraybuffer',
        httpsAgent: this.agent,
        headers: this.getRandomHeaders(baseUrl),
      });

      if (data.status !== 200) {
        console.error(`Axios fetch failed with status: ${data.status}`);
        return null;
      }

      console.log(`✅ GOT THE DATA: ${data.data.length} bytes`);
      return data.data;
    } catch (err) {
      console.error('❌ Axios fetch error', err);
      return null;
    }
  }

  public async uploadVault(creatorId: string, input: UploadVaultInput) {
    console.log({ creatorId, ...input });
    if (!input.vaultObjectIds.length) return;

    await Promise.all(
      input.vaultObjectIds.map(async (vaultObjectId) => {
        await this.vaultObjectsRepository.update(
          { id: vaultObjectId, status: DownloadStates.PENDING || DownloadStates.REJECTED },
          { status: DownloadStates.PROCESSING },
        );
      }),
    );

    await this.uploadVaultQueue.add({ creatorId, ...input });
    return 'Job added';
  }

  public async handleUpload(input: UploadVaultQueueInput) {
    const { vaultObjectIds, creatorId, destination } = input;
    if (!vaultObjectIds.length) return;
    console.log({ vaultObjectIds });

    try {
      for (const vaultObjectId of Array.from(new Set(vaultObjectIds))) {
        console.log({ before: vaultObjectId });

        const vaultObject = await this.vaultObjectsRepository.findOneOrFail({
          where: { id: vaultObjectId },
          relations: { vault: true },
        });

        console.log({ status_before: vaultObject.status });
        console.log({ after: vaultObjectId });

        if (vaultObject.status !== DownloadStates.FULFILLED) {
          console.log({ PROCESSING_URL: vaultObject.vault.url });
          console.log({ status_after: vaultObject.status });

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
              destination,
            );

            await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.FULFILLED });

            console.log(`✅ DOWNLOADED & UPLOADED: ${vaultObject.objectUrl}`);
          } catch (err) {
            console.error('❌ FAILED TO SAVE!', vaultObject.objectUrl, err?.message);
            await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.REJECTED });
          }
        }
      }
    } finally {
      console.log('The job is finished');
    }
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
