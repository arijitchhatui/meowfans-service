import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueTypes } from '../service.constants';
import { CreateScrapeQueueInput } from './dto/create-scrape.dto';
import { ScraperService } from './scraper.service';

@Processor(QueueTypes.UPLOAD_QUEUE)
export class ScrapeConsumerService {
  private logger = new Logger(ScrapeConsumerService.name);

  constructor(private scraperService: ScraperService) {}
  @Process()
  public async startConsuming(input: Job<CreateScrapeQueueInput>) {
    await this.scraperService.handleScrape(input.data);
  }
}
