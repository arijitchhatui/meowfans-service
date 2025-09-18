import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueTypes } from '../../util/enums';
import { CreateImportQueueInput } from './dto/create-import.dto';
import { ImportService } from './import.service';

@Processor(QueueTypes.UPLOAD_QUEUE)
export class ImportConsumerService {
  private logger = new Logger(ImportConsumerService.name);

  constructor(private importService: ImportService) {}
  @Process()
  public async startConsuming(input: Job<CreateImportQueueInput>) {
    this.logger.log({ message: 'Started consuming' });
    await this.importService.handleImport(input.data);
  }
}
