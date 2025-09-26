import { Module } from '@nestjs/common';
import { DownloaderModule } from '../downloader/downloader.module';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  providers: [AdminResolver, AdminService],
  imports: [DownloaderModule],
})
export class AdminModule {}
