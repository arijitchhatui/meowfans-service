import { Module } from '@nestjs/common';
import { DownloaderModule } from '../downloader/downloader.module';
import { ExtractorModule } from '../extractor/extractor.module';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  providers: [AdminResolver, AdminService],
  imports: [DownloaderModule, ExtractorModule],
})
export class AdminModule {}
