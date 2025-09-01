import { Injectable, Logger } from '@nestjs/common';
import { extname } from 'path';
import { Page } from 'puppeteer';
import { ExtensionTypes } from '../service.constants';

@Injectable()
export class DocumentSelectorService {
  private logger = new Logger(DocumentSelectorService.name);
  public async getAnchors(page: Page): Promise<string[]> {
    this.logger.log({ message: 'Getting anchors' });
    return await this.getImages(page);
    // return page.evaluate(() => Array.from(document.querySelectorAll('a')).map((a) => a.href));
  }

  public async getImages(page: Page): Promise<string[]> {
    return page.evaluate(() =>
      Array.from(document.querySelectorAll('img')).map(
        (img) => img.getAttribute('data-src') || img.getAttribute('src-set')?.split(' ').pop() || img.src,
      ),
    );
  }

  public filterByExtension(urls: string[]): string[] {
    this.logger.log({ message: 'Filtering extensions' });
    return urls.filter((url) => ExtensionTypes.includes(extname(url)));
  }
}
