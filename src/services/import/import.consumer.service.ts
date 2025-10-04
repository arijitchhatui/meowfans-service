import { Processor } from '@nestjs/bull';
import { QueueTypes } from '../../util/enums';
import { ImportService } from './import.service';

@Processor(QueueTypes.BATCH_IMPORT_OBJECT_QUEUE)
export class ImportConsumerService {
  constructor(private importService: ImportService) {}
}
