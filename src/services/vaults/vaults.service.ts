import { PaginationInput } from '@app/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { CreatorProfilesRepository, VaultsRepository } from '../postgres/repositories';
import { VaultsObjectsRepository } from '../postgres/repositories/vault-objects.repository';

@Injectable()
export class VaultsService {
  private logger = new Logger(VaultsService.name);
  constructor(
    private vaultsRepository: VaultsRepository,
    private vaultObjectsRepository: VaultsObjectsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
  ) {}

  public async getCreatorVaults(creatorId: string, input: PaginationInput) {
    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    return await this.vaultsRepository.find({
      where: { creatorId: creatorId },
      relations: { vaultObjects: true },
      skip: input.offset,
      take: input.limit,
      order: {
        id: input.orderBy,
      },
    });
  }

  public async getCreatorVaultObjects(creatorId: string, input: PaginationInput) {
    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    return await this.vaultObjectsRepository.getCreatorVaultObjects(creatorId, input).getMany();
  }

  public async getTotalObjectsAsType(input: PaginationInput) {
    return await this.vaultObjectsRepository.getTotalVaultObjectsAsType(input.status);
  }
}
