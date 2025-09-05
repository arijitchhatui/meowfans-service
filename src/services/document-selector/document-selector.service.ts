import { Injectable, Logger } from '@nestjs/common';
import { extname } from 'path';
import { Page } from 'puppeteer';
import { ExtensionTypes } from '../service.constants';

@Injectable()
export class DocumentSelectorService {
  private logger = new Logger(DocumentSelectorService.name);
  public async getAnchors(page: Page): Promise<string[]> {
    this.logger.log({ message: 'Getting anchors' });
    return page.evaluate(() => Array.from(document.querySelectorAll('a')).map((a) => a.href));
  }

  public async getImages(page: Page): Promise<string[]> {
    this.logger.log({ message: 'Getting images' });
    return page.evaluate(() =>
      Array.from(document.querySelectorAll('img')).map(
        (img) => img.getAttribute('data-src') || img.getAttribute('src-set')?.split(' ').pop() || img.src,
      ),
    );
  }

  public async getVideos(page: Page): Promise<string[]> {
    this.logger.log({ message: 'Getting videos' });
    return page.evaluate(() => Array.from(document.querySelectorAll('video')).map((video) => video.src));
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
}
