import { Injectable, Logger } from '@nestjs/common';
import { Page } from '@playwright/test';
import { extname } from 'path';
import { DocumentQualityType, HostNames } from '../../util/enums';
import { ExtensionTypes } from '../service.constants';

@Injectable()
export class DocumentSelectorService {
  private logger = new Logger(DocumentSelectorService.name);

  public async getContentUrls(page: Page, qualityType: DocumentQualityType): Promise<string[]> {
    this.logger.log({
      METHOD: this.getContentUrls.name,
      qualityType: qualityType,
    });

    switch (qualityType) {
      case DocumentQualityType.HIGH_DEFINITION:
        this.logger.log({
          METHOD: this.getContentUrls.name,
          message: 'Collecting HIGH_DEFINITION :: ANCHOR',
        });

        return await page.evaluate(() => Array.from(document.querySelectorAll('a')).map((a) => a.href));

      case DocumentQualityType.LOW_DEFINITION:
        this.logger.log({
          METHOD: this.getContentUrls.name,
          message: 'Collecting LOW_DEFINITION :: IMAGE',
        });

        return await page.evaluate(() =>
          Array.from(document.querySelectorAll('img'))
            .map(
              (img) =>
                img.src ||
                img.getAttribute('data-src') ||
                img.getAttribute('data-lazy') ||
                img.getAttribute('data-original'),
            )
            .filter((src): src is string => !!src),
        );

      case DocumentQualityType.DIV_DEFINITION:
        this.logger.log({
          METHOD: this.getContentUrls.name,
          message: 'Collecting DIV_DEFINITION :: IMAGE',
        });
        return await page.evaluate(() =>
          Array.from(document.querySelectorAll('div'))
            .map((div) => div.getAttribute('href'))
            .filter((href): href is string => !!href),
        );

      default:
        this.logger.log({
          METHOD: this.getContentUrls.name,
          message: 'Collecting DEFAULT_DEFINITION :: ANCHOR',
        });

        return await page.evaluate(() => Array.from(document.querySelectorAll('a')).map((a) => a.href));
    }
  }

  public async getAnchors(page: Page): Promise<string[]> {
    return await page.evaluate(() => Array.from(document.querySelectorAll('a')).map((anchor) => anchor.href));
  }

  public async getMetaDescription(page: Page): Promise<{ description: string; keywords: string[] }> {
    return await page.evaluate(() => {
      const description = document.querySelector('meta[name=description]')?.getAttribute('content') || '';
      const keywords = document.querySelector('meta[name=keywords]')?.getAttribute('content') || '';
      return { description, keywords: keywords.split(',') ?? [] };
    });
  }

  public async getVideoUrls(page: Page): Promise<string[]> {
    return await page.evaluate(() => Array.from(document.querySelectorAll('video')).map((vid) => vid.src));
  }

  public async getAnchorsBasedOnHostName(anchors: string[], url: string, subDirectory?: string): Promise<string[]> {
    const hostname = new URL(url).hostname as HostNames;
    this.logger.log({ hostname: hostname });

    switch (hostname) {
      case HostNames.COOMER:
        this.logger.log({
          METHOD: this.getAnchorsBasedOnHostName.name,
          TARGET_HOST_URL: 'COOMER',
        });

        return anchors.filter((anchor) => anchor.includes(`/${subDirectory}/post`));

      case HostNames.KEMONO:
        this.logger.log({
          METHOD: this.getAnchorsBasedOnHostName.name,
          TARGET_HOST_URL: 'KEMONO',
        });

        return anchors.filter((anchor) => anchor.includes(`/${subDirectory}/post`));

      case HostNames.WALLHAVEN:
        this.logger.log({
          METHOD: this.getAnchorsBasedOnHostName.name,
          TARGET_HOST_URL: 'WALLHAVEN',
        });

        return anchors.filter((anchor) => anchor.includes(`https://wallhaven.cc/w/`));

      default:
        return anchors;
    }
  }

  public filterByExtension(urls: string[], pageUrl: string): string[] {
    this.logger.log({
      METHOD: this.filterByExtension.name,
      FILTERING_BY_EXTENSION: 'JPG/JPEG ||>>>|| OTHER_WEBSITES',
    });

    let filtered = urls.filter((url) => ExtensionTypes.includes(extname(url)));
    if (pageUrl.includes('wallhaven.cc')) {
      filtered = filtered.filter((url) => url.includes('w.wallhaven.cc'));
    }

    return filtered;
  }

  public async getScreenShot(page: Page): Promise<Uint8Array<ArrayBufferLike>> {
    return await page.screenshot();
  }

  public async getPDFs(page: Page) {
    return await page.pdf();
  }

  public resolveMimeType(url: string): string {
    if (url.endsWith('.png')) return 'image/png';
    if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
    if (url.endsWith('.gif')) return 'image/gif';
    if (url.endsWith('.webp')) return 'image/webp';
    return 'application/octet-stream';
  }

  public createFileName(url: string) {
    return url.split('/').pop() ?? `file-${Date.now()}`;
  }
}
