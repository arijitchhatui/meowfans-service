import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Page } from 'puppeteer';
import { DocumentQualityType, HostNames } from '../../util/enums';
import { ExtensionTypes } from '../service.constants';

@Injectable()
export class DocumentSelectorService {
  private logger = new Logger(DocumentSelectorService.name);

  public async getContentUrls(page: Page, qualityType: DocumentQualityType): Promise<string[]> {
    this.logger.log({ qualityType: qualityType });
    switch (qualityType) {
      case DocumentQualityType.HIGH_DEFINITION:
        return await page.evaluate(() => Array.from(document.querySelectorAll('a')).map((a) => a.href));

      case DocumentQualityType.LOW_DEFINITION:
        return page.evaluate(() => Array.from(document.querySelectorAll('img')).map((img) => img.src));

      default:
        return await page.evaluate(() => Array.from(document.querySelectorAll('a')).map((a) => a.href));
    }
  }

  public async getAnchors(page: Page): Promise<string[]> {
    return await page.evaluate(() => Array.from(document.querySelectorAll('a')).map((anchor) => anchor.href));
  }

  public async getVideoUrls(page: Page): Promise<string[]> {
    return await page.evaluate(() => Array.from(document.querySelectorAll('video')).map((vid) => vid.src));
  }

  public async getAnchorsBasedOnHostName(anchors: string[], url: string, subDirectory?: string): Promise<string[]> {
    const hostname = new URL(url).hostname as HostNames;
    this.logger.log({ hostname: hostname });
    switch (hostname) {
      case HostNames.COOMER:
        return anchors.filter((anchor) => anchor.includes(`/${subDirectory}/post`));
      case HostNames.WALLHAVEN:
        return anchors.filter((anchor) => anchor.includes(`https://wallhaven.cc/w/`));
      default:
        return anchors;
    }
  }

  public filterByExtension(urls: string[]): string[] {
    this.logger.log({ message: 'Filtering extensions' });
    return urls.filter((url) => ExtensionTypes.includes(extname(url)));
  }

  public async getScreenShot(page: Page): Promise<Uint8Array<ArrayBufferLike>> {
    return await page.screenshot();
  }

  public async getPDFs(page: Page) {
    return await page.pdf();
  }

  public resolveMimeType(url: string): string {
    const ext = extname(url).substring(1);
    return ext ? `image/${ext}` : 'application/octet-stream';
  }

  public createFileName(link: string) {
    return `public_${randomUUID()}${extname(link)}`;
  }
}
