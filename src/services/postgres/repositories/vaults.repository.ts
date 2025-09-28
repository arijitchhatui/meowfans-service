import { PaginationInput } from '@app/helpers';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { FileType } from '../../../util/enums';
import { BulkInsertVaultInput } from '../../vaults/dto';
import { VaultsEntity } from '../entities/vaults.entity';
import { CreatorProfilesRepository } from './creator-profiles.repository';
import { VaultsObjectsRepository } from './vault-objects.repository';

@Injectable()
export class VaultsRepository extends Repository<VaultsEntity> {
  private logger = new Logger(VaultsRepository.name);

  constructor(
    @Optional() _target: EntityTarget<VaultsEntity>,
    entityManager: EntityManager,
    private creatorProfilesRepository: CreatorProfilesRepository,
    private vaultObjectsRepository: VaultsObjectsRepository,
  ) {
    super(VaultsEntity, entityManager);
  }

  public async getCreatorVaults(creatorId: string, input: PaginationInput) {
    return await this.createQueryBuilder('cv')
      .where('cv.creatorId = :creatorId', { creatorId })
      .orderBy('cv.createdAt', input.orderBy)
      .limit(input.limit)
      .offset(input.offset)
      .getMany();
  }

  public async bulkInsert(creatorId: string, input: BulkInsertVaultInput) {
    const { objects, baseUrl } = input;

    if (!objects.length) return;

    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    let vault = await this.findOne({ where: { url: baseUrl, creatorId: creatorId } });

    if (!vault) {
      vault = await this.save({
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
        });
        this.logger.log('VAULT OBJECT INSERTED✅✅✅✅');
      }
    }
  }
}
