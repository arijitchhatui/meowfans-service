import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueTypes } from '../../util/enums';
import { DownloadAllCreatorObjectsAsBatchInput } from '../vaults/dto';
import { AdminService } from './admin.service';

@Processor(QueueTypes.BATCH_UPLOAD_VAULT_QUEUE)
export class AdminConsumerService {
  private logger = new Logger(AdminConsumerService.name);

  constructor(private adminService: AdminService) {}

  @Process()
  public async startBatchDownload(input: Job<DownloadAllCreatorObjectsAsBatchInput>) {
    this.logger.log({ JOB_STARTED: 'Started batch downloading' });
    try {
      await this.adminService.handleDownloadAllCreatorObjects(input.data);
    } catch (error) {
      console.log('Consumer error while batch downloading', error);
    }
  }
}
