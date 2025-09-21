import { Module } from '@nestjs/common';
import { AssetsService } from '../assets';
import { AwsS3Module } from '../aws';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { DownloaderResolver } from './downloader.resolver';
import { DownloaderService } from './downloader.service';

@Module({
  imports: [AwsS3Module],
  providers: [DownloaderService, DocumentSelectorService, AssetsService, DownloaderService, DownloaderResolver],
  exports: [DownloaderService],
})
export class DownloaderModule {}
