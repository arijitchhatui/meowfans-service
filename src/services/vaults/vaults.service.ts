import { PaginationInput } from '@app/helpers';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Queue } from 'bull';
import { cluster } from 'radash';
import { FileType, QueueTypes } from '../../util/enums';
import { DownloadStates } from '../../util/enums/download-state';
import { ImportTypes } from '../../util/enums/import-types';
import {
  AssetsRepository,
  CreatorProfilesRepository,
  UsersRepository,
  VaultsRepository,
} from '../postgres/repositories';
import { VaultsObjectsRepository } from '../postgres/repositories/vault-objects.repository';
import {
  BulkInsertVaultInput,
  GetDefaultVaultObjectsOutput,
  GetDefaultVaultsOutput,
  UpdatePreviewOfVaultsInput,
} from './dto';

@Injectable()
export class VaultsService {
  private logger = new Logger(VaultsService.name);
  constructor(
    private readonly vaultsRepository: VaultsRepository,
    private readonly vaultObjectsRepository: VaultsObjectsRepository,
    private readonly creatorProfilesRepository: CreatorProfilesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly assetsRepository: AssetsRepository,
    @InjectQueue(QueueTypes.UPDATE_PREVIEW_OF_VAULT)
    private readonly updatePreviewOfVaultsQueue: Queue<UpdatePreviewOfVaultsInput>,
  ) {}

  public async getVaultObjectsByVaultId(input: PaginationInput): Promise<GetDefaultVaultObjectsOutput> {
    const vault = await this.vaultsRepository.findOneOrFail({ where: { id: input.relatedEntityId } });
    const vaultObjects = await this.vaultObjectsRepository.getVaultObjectsByVaultId(input);
    return { vault, ...vaultObjects };
  }

  public async getCreatorVaultObjects(creatorId: string, input: PaginationInput) {
    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    return await this.vaultObjectsRepository.getCreatorVaultObjects(creatorId, input).getMany();
  }

  public async getTotalObjectsAsType(input: PaginationInput) {
    return await this.vaultObjectsRepository.getTotalVaultObjectsAsType(input.status);
  }

  public async getCountOfObjectsOfEachType() {
    return await this.vaultObjectsRepository.getCountOfObjectsOfEachType();
  }

  public async getDefaultVaults(input: PaginationInput): Promise<GetDefaultVaultsOutput> {
    const { pageNumber, take } = input;
    const skip = (pageNumber - 1) * take;

    const [vaults, count] = await this.vaultsRepository.getDefaultVaults({ ...input, skip });

    const totalPages = Math.ceil(count / take);
    const hasPrev = pageNumber > 1;
    const hasNext = pageNumber < totalPages;
    return { vaults, count, totalPages, hasNext, hasPrev };
  }

  public async updatePreviewOfVaults(adminId: string) {
    const isAdmin = await this.usersRepository.isAdmin(adminId);
    if (!isAdmin) throw new UnauthorizedException({ message: 'unauthorized' });
    await this.updatePreviewOfVaultsQueue.add({ adminId });
    return 'Done';
  }

  public async handleUpdatePreviewOfVaults(input: UpdatePreviewOfVaultsInput) {
    const isAdmin = await this.usersRepository.isAdmin(input.adminId);
    if (!isAdmin) return;

    const vaults = await this.vaultsRepository.find();
    const chunks = cluster(Array.from(new Set(vaults)), 15);
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (vault) => {
          try {
            const exists = await this.vaultObjectsRepository.findOne({
              where: { status: DownloadStates.FULFILLED, vaultId: vault.id },
            });
            if (exists) {
              const previewAsset = await this.assetsRepository.findOne({ where: { vaultObjectId: exists.id } });
              if (previewAsset) await this.vaultsRepository.update({ id: vault.id }, { preview: previewAsset.rawUrl });
              this.logger.log({ UPDATED: vault.id });
            }
          } catch (error) {
            this.logger.error(error.message);
          }
        }),
      );
    }
  }

  public async bulkInsert(creatorId: string, input: BulkInsertVaultInput) {
    const { objects, baseUrl, contentType, importType, keywords, description } = input;

    if (!objects.length) return;

    await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId: creatorId } });
    let vault = await this.vaultsRepository.findOne({ where: { url: baseUrl, creatorId: creatorId } });

    if (!vault) vault = await this.vaultsRepository.save({ creatorId: creatorId, url: baseUrl, keywords, description });

    for (const objectUrl of objects) {
      const exists = await this.vaultObjectsRepository.findOne({ where: { objectUrl: objectUrl } });
      if (!exists) {
        const isImage = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(objectUrl);
        await this.vaultObjectsRepository.save({
          vault: vault,
          objectUrl: objectUrl,
          fileType: isImage ? FileType.IMAGE : FileType.VIDEO,
          contentType: contentType,
          suffix: importType.includes(ImportTypes.OK)
            ? Number(objectUrl.split('/').filter(Boolean).pop()!.split('.')[0])
            : null,
        });
        this.logger.log('VAULT OBJECT INSERTED✅✅✅✅');
      }
    }
  }
}
