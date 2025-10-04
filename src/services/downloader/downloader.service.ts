import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bull';
import { Agent } from 'https';
import Redis from 'ioredis';
import { cluster } from 'radash';
import { In } from 'typeorm';
import { MediaType, ProviderTokens, QueueTypes } from '../../util/enums';
import { DownloadStates } from '../../util/enums/download-state';
import { AssetsService } from '../assets';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { VaultsObjectsRepository } from '../postgres/repositories';
import { headerPools } from '../service.constants';
import { SSEService } from '../sse/sse.service';
import { UploadVaultInput, UploadVaultQueueInput } from './dto';

@Injectable()
export class DownloaderService {
  private logger = new Logger(DownloaderService.name);
  private isTerminated = false;

  private readonly agent = new Agent({
    family: 4,
    keepAlive: true,
    maxSockets: 50,
  });

  constructor(
    @InjectQueue(QueueTypes.UPLOAD_VAULT_QUEUE)
    private readonly uploadVaultQueue: Queue<UploadVaultQueueInput>,
    private readonly vaultObjectsRepository: VaultsObjectsRepository,
    private readonly documentSelectorService: DocumentSelectorService,
    private readonly assetsService: AssetsService,
    @Inject(ProviderTokens.REDIS_TOKEN) private readonly redis: Redis,
    private readonly sseService: SSEService,
  ) {}

  onModuleInit() {
    // this.uploadVaultQueue.on('active', (e) => this.logger.log('active', e));
    // this.uploadVaultQueue.on('error', (e) => this.logger.log('error', e));
    // this.uploadVaultQueue.on('failed', (e) => this.logger.log('failed', e));
  }

  public async terminateDownloading() {
    this.isTerminated = true;

    this.redis.flushall();
    this.redis.flushdb();
    this.logger.log({ message: 'Terminated downloading', method: this.terminateDownloading.name });
  }

  public async startDownloading() {
    this.isTerminated = false;
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

      this.logger.log(`✅ GOT THE DATA: ${data.data.length} bytes`);
      return data.data;
    } catch (err) {
      this.logger.error('❌ Axios fetch error', err.message);
      return null;
    }
  }

  public async uploadVault(creatorId: string, input: UploadVaultInput) {
    this.isTerminated = false;
    this.startDownloading();
    if (!input.vaultObjectIds.length) return;

    this.logger.log({ method: this.uploadVault.name, creatorId, ...input });
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
    const { vaultObjectIds } = input;
    if (!vaultObjectIds.length) return;

    this.logger.log({ method: this.handleUpload.name, vaultObjectIds });
    const finalMessage = this.isTerminated
      ? '⚠️⚠️⚠️ THE DOWNLOADING PROCESS IS TERMINATED FORCEFULLY ⚠️⚠️⚠️'
      : `ALL OBJECTS DOWNLOADED FOR ${input.creatorId}`;

    try {
      for (const chunk of cluster(Array.from(new Set(vaultObjectIds)), 5)) {
        if (this.isTerminated) {
          const terminatedResult = await this.vaultObjectsRepository.update(
            { id: In(vaultObjectIds), status: DownloadStates.PROCESSING },
            { status: DownloadStates.PENDING },
          );
          this.logger.log({ method: this.handleUpload.name, Result: terminatedResult.affected });
          break;
        }

        await Promise.all(
          chunk.map(async (vaultObjectId) => {
            await this.handleChunkUpload(vaultObjectId, input);
          }),
        );
      }
    } finally {
      this.logger.log({ MESSAGE: finalMessage });
      // this.sseService.publish(input.creatorId, { finalMessage }, EventTypes.VaultDownloadCompleted);

      await this.vaultObjectsRepository.update(
        { id: In(vaultObjectIds), status: DownloadStates.PROCESSING },
        { status: DownloadStates.REJECTED },
      );
      this.isTerminated = false;
    }
  }

  private async handleChunkUpload(vaultObjectId: string, input: UploadVaultQueueInput) {
    const { creatorId, destination } = input;
    const vaultObject = await this.vaultObjectsRepository.findOneOrFail({
      where: { id: vaultObjectId },
      relations: { vault: true },
    });

    if (this.isTerminated) return;

    if (vaultObject.status !== DownloadStates.FULFILLED) {
      try {
        const buffer = await this.fetch(vaultObject.objectUrl, vaultObject.vault.url);
        const mimeType = this.documentSelectorService.resolveMimeType(vaultObject.objectUrl);

        if (buffer !== null) {
          await this.assetsService.uploadFileV2(
            creatorId,
            vaultObject.objectUrl,
            MediaType.POST_MEDIA,
            buffer,
            mimeType,
            destination,
            vaultObject.id,
          );
          await this.markAsFulfilled(creatorId, vaultObject.id);
          this.logger.log({ METHOD: this.handleUpload.name, DOWNLOADED_AND_UPLOADED: vaultObject.objectUrl });
        } else await this.markAsRejected(creatorId, vaultObject.id);
      } catch {
        this.logger.error({ message: '❌ FAILED TO SAVE!', url: vaultObject.objectUrl });
        await this.markAsRejected(creatorId, vaultObjectId);
      }
    }
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }

  private async markAsProcessing(creatorId: string, vaultObjectId: string) {
    await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.PROCESSING });
  }

  private async markAsFulfilled(creatorId: string, vaultObjectId: string) {
    await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.FULFILLED });
  }

  private async markAsPending(creatorId: string, vaultObjectId: string) {
    await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.PENDING });
  }

  private async markAsRejected(creatorId: string, vaultObjectId: string) {
    await this.vaultObjectsRepository.update({ id: vaultObjectId }, { status: DownloadStates.REJECTED });
  }
}
