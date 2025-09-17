import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { headerPools } from '../service.constants';

@Injectable()
export class DownloaderService {
  public async fetch(downloadUrl: string, baseUrl: string): Promise<Buffer<ArrayBufferLike>> {
    console.log('GETTING RESPONSE FROM AXIOS 🔵');

    const { data } = await axios.get<Buffer<ArrayBufferLike>>(downloadUrl, {
      responseType: 'arraybuffer',
      headers: this.getRandomHeaders(baseUrl),
    });
    return data;
  }

  private getRandomHeaders(baseUrl: string) {
    const header = headerPools[Math.floor(Math.random() * headerPools.length)];
    return Object.fromEntries(Object.entries({ ...header, Referer: baseUrl }));
  }
}
