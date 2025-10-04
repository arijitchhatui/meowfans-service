import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueTypes } from '../../util/enums';
import { CreateImportQueueInput } from './dto/create-import.dto';
import { ExtractorService } from './extractor.service';

@Processor(QueueTypes.UPLOAD_QUEUE)
export class ExtractorConsumerService {
  private logger = new Logger(ExtractorConsumerService.name);
  constructor(private extractorService: ExtractorService) {}

  @Process({ concurrency: 5 })
  public async startConsuming(input: Job<CreateImportQueueInput>) {
    this.logger.log({ message: 'Started consuming' });
    try {
      await this.extractorService.handleImport(input.data);
    } catch (error) {
      console.log('consumer error', error);
    }
  }
}
