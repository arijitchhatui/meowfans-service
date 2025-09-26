import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bull';
import { Agent } from 'https';
import Redis from 'ioredis';
import { In } from 'typeorm';
import { MediaType, ProviderTokens, QueueTypes } from '../../util/enums';
import { DownloadStates } from '../../util/enums/download-state';
import { AssetsService } from '../assets';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { VaultsObjectsRepository } from '../postgres/repositories';
import { headerPools } from '../service.constants';
import { UploadVaultInput, UploadVaultQueueInput } from './dto';

@Injectable()
export class DownloaderService {
  private logger = new Logger(DownloaderService.name);
  private isTerminated = false;

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
    @Inject(ProviderTokens.REDIS_TOKEN) private redis: Redis,
  ) {}

  onModuleInit() {
    this.uploadVaultQueue.on('active', (e) => this.logger.log('active', e));
    this.uploadVaultQueue.on('error', (e) => this.logger.log('error', e));
    this.uploadVaultQueue.on('failed', (e) => this.logger.log('failed', e));
  }

  public async terminateDownloading() {
    if (this.isTerminated) return;
    this.isTerminated = true;

    this.redis.flushall();
    this.redis.flushdb();
    this.logger.log({ message: 'Terminated downloading', method: this.terminateDownloading.name });
  }

  public async fetch(downloadUrl: string, baseUrl: string): Promise<Buffer | null> {
    this.logger.log('PROCESSING REQUEST THROUGH AXIOS 🚀🚀🚀🚀');
    this.logger.log({ downloadUrl, baseUrl });

    try {
      const data = await axios.get<Buffer<ArrayBuffer>>(downloadUrl, {
        method: 'GET',
        responseType: 'arraybuffer',
        httpsAgent: this.agent,
        headers: this.getRandomHeaders(baseUrl),
      });

      if (data.status !== 200) {
        this.logger.error(`Axios fetch failed with status: ${data.status}`);
        return null;
      }

      this.logger.log(`✅ GOT THE DATA: ${data.data.length} bytes`);
      return data.data;
    } catch (err) {
      this.logger.error('❌ Axios fetch error', err);
      return null;
    }
  }

  public async uploadVault(creatorId: string, input: UploadVaultInput) {
    this.isTerminated = false;

    this.logger.log({
      method: this.uploadVault.name,
      creatorId,
      ...input,
    });

    if (!input.vaultObjectIds.length) return;

    this.logger.log({ vaultObjectIds: input.vaultObjectIds });

    const validObjectIds = await this.vaultObjectsRepository.find({
      where: { id: In(input.vaultObjectIds), status: In([DownloadStates.PENDING, DownloadStates.REJECTED]) },
    });

    const toBeDownloadedIds = validObjectIds.map((validObject) => validObject.id);

    this.logger.log({ toBeDownloadedIds });

    const result = await this.vaultObjectsRepository.update(
      { id: In(toBeDownloadedIds) },
      { status: DownloadStates.PROCESSING },
    );

    this.logger.log({ method: this.uploadVault.name, affected: result.affected });

    await this.uploadVaultQueue.add({ creatorId, ...input, vaultObjectIds: toBeDownloadedIds });
    return 'Job added';
  }

  public async handleUpload(input: UploadVaultQueueInput) {
    const { vaultObjectIds, creatorId, destination } = input;
    if (!vaultObjectIds.length) return;

    this.logger.log({
      method: this.handleUpload.name,
      vaultObjectIds,
    });

    try {
      for (const vaultObjectId of Array.from(new Set(vaultObjectIds))) {
        this.logger.log({
          method: this.handleUpload.name,
          before: vaultObjectId,
        });

        if (this.isTerminated) {
          const terminatedResult = await this.vaultObjectsRepository.update(
            { id: In(vaultObjectIds), status: DownloadStates.PROCESSING },
            { status: DownloadStates.PENDING },
          );
          this.logger.log({ method: this.handleUpload.name, Result: terminatedResult.affected });
          break;
        }

        const vaultObject = await this.vaultObjectsRepository.findOneOrFail({
          where: { id: vaultObjectId },
          relations: { vault: true },
        });

        this.logger.log({ method: this.handleUpload.name, status_before: vaultObject.status });
        this.logger.log({ method: this.handleUpload.name, after: vaultObjectId });

        if (vaultObject.status !== DownloadStates.FULFILLED) {
          this.logger.log({ method: this.handleUpload.name, PROCESSING_URL: vaultObject.vault.url });
          this.logger.log({ method: this.handleUpload.name, status_after: vaultObject.status });

          try {
            const buffer = await this.fetch(vaultObject.objectUrl, vaultObject.vault.url);
            const mimeType = this.documentSelectorService.resolveMimeType(vaultObject.objectUrl);

            if (!buffer) throw new Error('AXIOS ERROR :: RETURNING');

            await this.assetsService.uploadFileV2(
              creatorId,
              vaultObject.objectUrl,
              MediaType.PROFILE_MEDIA,
              buffer,
              mimeType,
              destination,
            );

            await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.FULFILLED });

            this.logger.log({
              'method': this.handleUpload.name,
              '✅ DOWNLOADED & UPLOADED': `${vaultObject.objectUrl}`,
            });
          } catch (err) {
            this.logger.error({
              message: '❌ FAILED TO SAVE!',
              url: vaultObject.objectUrl,
              method: this.handleUpload.name,
            });
            this.logger.error(err);
            await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.REJECTED });
          }
        }
      }
    } finally {
      this.logger.log({
        MESSAGE: this.isTerminated
          ? '⚠️⚠️⚠️ THE DOWNLOADING PROCESS IS TERMINATED FORCEFULLY ⚠️⚠️⚠️'
          : 'ALL OBJECTS DOWNLOADED',
      });
      this.isTerminated = false;
    }
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
