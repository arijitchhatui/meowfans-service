import { PaginationInput } from '@app/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { CreatorProfilesRepository, VaultsRepository } from '../postgres/repositories';
import { InsertVaultInput } from './dto';

@Injectable()
export class VaultsService {
  private logger = new Logger(VaultsService.name);
  constructor(
    private vaultsRepository: VaultsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
  ) {}

  public async bulkInsert(creatorId: string, input: InsertVaultInput) {
    const { urls } = input;
    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    for (const url of Array.from(new Set(urls))) {
      const exists = await this.vaultsRepository.exists({ where: { url: url, creatorId: creatorId } });
      if (exists) return;
      const vault = this.vaultsRepository.create({ creatorId: creatorId, url: url });
      await this.vaultsRepository.save(vault);
    }
  }

  public async updateStatusToFulfilledState(creatorId: string, url: string) {
    await this.vaultsRepository.updateStatusToFulfilledState(creatorId, url);
  }

  public async updateStatusToRejectedState(creatorId: string, id: string) {
    await this.vaultsRepository.updateStatusToRejectedState(creatorId, id);
  }

  public async getCreatorVaults(creatorId: string, input: PaginationInput) {
    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    return await this.vaultsRepository.getCreatorVaults(creatorId, input);
  }
}
