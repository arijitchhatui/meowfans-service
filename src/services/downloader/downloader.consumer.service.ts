import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueTypes } from '../../util/enums';
import { DownloaderService } from './downloader.service';
import { UploadVaultQueueInput } from './dto';

@Processor(QueueTypes.UPLOAD_VAULT_QUEUE)
export class DownloaderConsumerService {
  private logger = new Logger(DownloaderConsumerService.name);

  constructor(private downloaderService: DownloaderService) {}

  onModuleInit() {}

  @Process()
  public async startDownloading(input: Job<UploadVaultQueueInput>) {
    this.logger.log({ JOB_STARTED: 'started downloading' });
    try {
      await this.downloaderService.handleUpload(input.data);
    } catch (error) {
      console.log('consumer error 2', error);
    }
  }
}
