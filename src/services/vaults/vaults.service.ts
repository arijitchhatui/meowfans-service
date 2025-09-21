import { PaginationInput } from '@app/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { CreatorProfilesRepository, VaultsRepository } from '../postgres/repositories';
import { VaultsObjectsRepository } from '../postgres/repositories/vault-objects.repository';
import { BulkInsertVaultInput } from './dto';

@Injectable()
export class VaultsService {
  private logger = new Logger(VaultsService.name);
  constructor(
    private vaultsRepository: VaultsRepository,
    private vaultObjectsRepository: VaultsObjectsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
  ) {}

  public async bulkInsert(creatorId: string, input: BulkInsertVaultInput) {
    const { objects, baseUrl } = input;

    if (!objects.length) return;

    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    const exists = await this.vaultsRepository.exists({ where: { url: baseUrl, creatorId: creatorId } });

    if (exists) return;

    const vault = await this.vaultsRepository.save({
      creatorId: creatorId,
      url: baseUrl,
    });

    for (const objectUrl of objects) {
      const exists = await this.vaultObjectsRepository.findOne({ where: { objectUrl: objectUrl } });
      if (!exists) {
        this.logger.log('VAULT OBJECT INSERTED✅✅✅✅');
        await this.vaultObjectsRepository.save({ vaultId: vault.id, objectUrl: objectUrl });
      }
    }
  }

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
    return await this.vaultObjectsRepository.getCreatorVaultObjects(creatorId, input);
  }
}
