import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { headerPools } from '../service.constants';

@Injectable()
export class DownloaderService {
  private logger = new Logger(DownloaderService.name);
  public async fetch(downloadUrl: string, baseUrl: string): Promise<Buffer<ArrayBufferLike> | null> {
    this.logger.log('GETTING RESPONSE FROM AXIOS 🔵');
    try {
      const { data } = await axios.get<Buffer<ArrayBufferLike>>(downloadUrl, {
        responseType: 'arraybuffer',
        headers: this.getRandomHeaders(baseUrl),
      });
      return data;
    } catch {
      this.logger.error('Axios error');
    }
    return null;
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
