import { PaginationInput } from '@app/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { EventTypes, FileType } from '../../util/enums';
import { DownloadStates } from '../../util/enums/download-state';
import { CreatorProfilesRepository, VaultsRepository } from '../postgres/repositories';
import { VaultsObjectsRepository } from '../postgres/repositories/vault-objects.repository';
import { SSEService } from '../sse/sse.service';
import { BulkInsertVaultInput, GetAllObjectsCountOutput } from './dto';

@Injectable()
export class VaultsService {
  private logger = new Logger(VaultsService.name);
  constructor(
    private vaultsRepository: VaultsRepository,
    private vaultObjectsRepository: VaultsObjectsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
    private sseService: SSEService,
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

  public async getCountOfObjectsOfEachType() {
    return (await this.vaultObjectsRepository.getCountOfObjectsOfEachType()) as GetAllObjectsCountOutput;
  }

  public async bulkInsert(creatorId: string, input: BulkInsertVaultInput) {
    const { objects, baseUrl, contentType } = input;

    if (!objects.length) return;

    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    let vault = await this.vaultsRepository.findOne({ where: { url: baseUrl, creatorId: creatorId } });

    if (!vault) {
      vault = await this.vaultsRepository.save({
        creatorId: creatorId,
        url: baseUrl,
      });
    }

    for (const objectUrl of objects) {
      const exists = await this.vaultObjectsRepository.findOne({ where: { objectUrl: objectUrl } });
      if (!exists) {
        const isImage = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(objectUrl);
        await this.vaultObjectsRepository.save({
          vault: vault,
          objectUrl: objectUrl,
          fileType: isImage ? FileType.IMAGE : FileType.VIDEO,
          contentType: contentType,
        });
        this.sseService.publish(creatorId, { status: DownloadStates.PENDING }, EventTypes.ImportObject);
        this.logger.log('VAULT OBJECT INSERTED✅✅✅✅');
      }
    }
  }
}
