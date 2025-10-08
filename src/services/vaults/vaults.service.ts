import { PaginationInput } from '@app/helpers';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Queue } from 'bull';
import { cluster } from 'radash';
import { In } from 'typeorm';
import { FileType, QueueTypes } from '../../util/enums';
import { DownloadStates } from '../../util/enums/download-state';
import { ImportTypes } from '../../util/enums/import-types';
import {
  AssetsRepository,
  CreatorProfilesRepository,
  TagsRepository,
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
    private readonly tagsRepository: TagsRepository,
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

    try {
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
                if (previewAsset)
                  await this.vaultsRepository.update({ id: vault.id }, { preview: previewAsset.rawUrl });
                this.logger.log({ UPDATED: vault.id });
              }
            } catch (error) {
              this.logger.error(error.message);
            }
          }),
        );
      }
    } finally {
      this.logger.log({ MESSAGE: 'ALL PREVIEWS UPDATED' });
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

  public async getTags(input: PaginationInput) {
    return await this.tagsRepository.getTags(input);
  }

  public async createTags() {
    const vaults = await this.vaultsRepository.find();

    const keywords = Array.from(
      new Set(
        vaults
          .map((v) => {
            const final: string[] = [];
            final.push(...(v.keywords?.map((k) => k.toLowerCase().trim()) ?? []));
            return final;
          })
          .flat(1),
      ),
    );

    this.logger.log(`Chunk Size ${keywords.length}`);
    for (const keywordChunk of cluster(keywords, 10000)) {
      await this.tagsRepository.save(keywordChunk.filter((v) => v).map((label) => ({ label })));
      this.logger.log('Chunk Saved');
    }
    this.logger.log('Chunk Saved (Done)');
  }

  public async createVaultTags() {
    const vaults = await this.vaultsRepository.find();

    this.logger.log({ total: vaults.length });
    for (const vault of vaults) {
      const keywords = (vault.keywords ?? []).filter((v) => v).map((v) => v.toLowerCase().trim());
      const tags = await this.tagsRepository.find({ where: { label: In(keywords) } });

      if (tags.length) {
        vault.tags = tags;
      }
      this.logger.log({ message: 'done', id: vault.id });
    }

    this.logger.log(`Chunk Size ${vaults.length}`);
    for (const vChunk of cluster(
      vaults.filter((v) => v.tags?.length),
      1000,
    )) {
      await this.vaultsRepository.save(vChunk);
      this.logger.log('Chunk Saved');
    }
    this.logger.log('Chunk Saved (Done)');
  }
}
