import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueTypes } from '../../util/enums';
import { UpdatePreviewOfVaultsInput } from './dto';
import { VaultsService } from './vaults.service';

@Processor(QueueTypes.UPDATE_PREVIEW_OF_VAULT)
export class VaultsConsumerService {
  private logger = new Logger(VaultsConsumerService.name);

  constructor(private readonly vaultsService: VaultsService) {}
  @Process()
  public async startUpdatingPreviewOfVaults(input: Job<UpdatePreviewOfVaultsInput>) {
    try {
      this.logger.log({ message: 'Started updating preview of vaults' });
      await this.vaultsService.handleUpdatePreviewOfVaults(input.data);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
