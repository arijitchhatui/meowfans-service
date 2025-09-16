import { HasSubdirectoryForBranch } from '@app/validators';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nestjs-pptr';
import { AssetsService } from '../assets';
import { AwsS3Module } from '../aws';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { DownloaderService } from '../downloader/downloader.service';
import { QueueTypes } from '../service.constants';
import { ScrapeConsumerService } from './scrape-consumer.service';
import { ScraperResolver } from './scraper.resolver';
import { ScraperService } from './scraper.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueTypes.UPLOAD_QUEUE,
    }),
    PuppeteerModule.forRootAsync({
      useFactory: () => ({
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      }),
    }),
    AwsS3Module,
  ],
  providers: [
    ScraperService,
    ScraperResolver,
    AssetsService,
    DownloaderService,
    DocumentSelectorService,
    ScrapeConsumerService,
    HasSubdirectoryForBranch,
  ],
})
export class ScraperModule {}
