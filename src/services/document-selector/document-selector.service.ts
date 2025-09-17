import { DocumentQualityType, FileType, HostNames } from '@app/enums';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Page } from 'puppeteer';
import { ExtensionTypes } from '../service.constants';

@Injectable()
export class DocumentSelectorService {
  private logger = new Logger(DocumentSelectorService.name);

  public async getImageUrls(page: Page, qualityType: DocumentQualityType): Promise<string[]> {
    this.logger.log({ message: 'Getting anchors' });

    switch (qualityType) {
      case DocumentQualityType.HIGH_DEFINITION:
        return page.evaluate(() => Array.from(document.querySelectorAll('a')).map((a) => a.href));

      case DocumentQualityType.LOW_DEFINITION:
        return page.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(
            (img) => img.getAttribute('data-src') || img.getAttribute('src-set')?.split(' ').pop() || img.src,
          );
        });

      default:
        return page.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(
            (img) => img.getAttribute('data-src') || img.getAttribute('src-set')?.split(' ').pop() || img.src,
          );
        });
    }
  }

  public async getAnchors(page: Page): Promise<string[]> {
    return page.evaluate(() => Array.from(document.querySelectorAll('a')).map((anchor) => anchor.href));
  }

  public async getVideoUrls(page: Page): Promise<string[]> {
    return await page.evaluate(() => Array.from(document.querySelectorAll('video')).map((vid) => vid.src));
  }

  public async getAnchorsBasedOnHostName(anchors: string[], url: string, subDirectory?: string): Promise<string[]> {
    const hostname = new URL(url).hostname as HostNames;
    switch (hostname) {
      case HostNames.COOMER:
        return anchors.filter((anchor) => anchor.includes(`/${subDirectory}/post`));
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

  public async handleFileType(page: Page, fileType: FileType, qualityType: DocumentQualityType) {
    switch (fileType) {
      case FileType.IMAGE: {
        const anchors = await this.getImageUrls(page, qualityType);
        return this.filterByExtension(anchors);
      }

      case FileType.VIDEO:
        return await this.getVideoUrls(page);

      default:
        return [];
    }
  }
}
