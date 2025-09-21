import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Agent } from 'https';
import { MediaType } from '../../util/enums';
import { AssetsService } from '../assets';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { VaultsEntity } from '../postgres/entities';
import { VaultsRepository } from '../postgres/repositories';
import { headerPools } from '../service.constants';
import { InsertVaultInput } from '../vaults/dto';

@Injectable()
export class DownloaderService {
  constructor(
    private vaultsRepository: VaultsRepository,
    private assetsService: AssetsService,
    private documentSelectorService: DocumentSelectorService,
  ) {}

  private logger = new Logger(DownloaderService.name);
  private readonly agent = new Agent({
    family: 4,
    keepAlive: true,
    maxSockets: 10,
  });

  public async fetch(downloadUrl: string, baseUrl: string): Promise<Buffer<ArrayBufferLike> | null> {
    this.logger.log('GETTING RESPONSE FROM AXIOS 🔵');
    try {
      const { data } = await axios.get<ArrayBuffer>(downloadUrl, {
        responseType: 'arraybuffer',
        headers: this.getRandomHeaders(baseUrl),
        httpsAgent: this.agent,
      });
      this.logger.log('GOT THE DATA');
      return Buffer.from(data);
    } catch {
      this.logger.error('Axios error');
    }
    return null;
  }

  public async uploadVaults(creatorId: string, input: InsertVaultInput) {
    const { urls } = input;
    this.logger.log(urls);

    const updatedVaults: VaultsEntity[] = [];
    for (const url of urls) {
      try {
        const buffer = await this.fetch(url, url);
        const mimeType = this.documentSelectorService.resolveMimeType(url);

        if (!buffer) throw new Error('AXIOS ERROR :: RETURNING');

        await this.assetsService.uploadFileV2(creatorId, url, MediaType.PROFILE_MEDIA, buffer, mimeType);
        await this.vaultsRepository.updateStatusToFulfilledState(creatorId, url);
        const updated = await this.vaultsRepository.findOneOrFail({ where: { creatorId: creatorId, url: url } });

        updatedVaults.push(updated);
        this.logger.log(`DOWNLOADED & UPLOADED: ${url}`);
      } catch (err) {
        this.logger.error('❌ FAILED TO SAVE!', url, err?.message);
      }
    }

    return updatedVaults;
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
