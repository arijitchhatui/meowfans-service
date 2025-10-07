import { PaginationInput } from '@app/helpers';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { AssetType, QueueTypes } from '../../util/enums';
import { CreatorProfilesService, ExtendedUpdateCreatorProfileInput, GetAllCreatorsOutput } from '../creator-profiles';
import { DownloaderService } from '../downloader/downloader.service';
import { UploadVaultQueueInput } from '../downloader/dto';
import { ExtractorService } from '../extractor/extractor.service';
import { CreateImportQueueInput } from '../import/dto';
import { CreatorAssetsRepository, UsersRepository, VaultsObjectsRepository } from '../postgres/repositories';
import { DownloadAllCreatorObjectsAsBatchInput, GetCreatorVaultObjectsOutput } from '../vaults/dto';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);

  constructor(
    private downloaderService: DownloaderService,
    private usersRepository: UsersRepository,
    private vaultObjectsRepository: VaultsObjectsRepository,
    private creatorAssetsRepository: CreatorAssetsRepository,
    private extractorService: ExtractorService,
    private creatorProfilesServices: CreatorProfilesService,
    @InjectQueue(QueueTypes.BATCH_UPLOAD_VAULT_QUEUE)
    private batchUploadVaultQueue: Queue<DownloadAllCreatorObjectsAsBatchInput>,
  ) {}

  public async getAllCreators(input: PaginationInput): Promise<GetAllCreatorsOutput> {
    const { pageNumber, take } = input;
    const skip = (pageNumber - 1) * take;
    const [users, count] = await this.usersRepository.getAllCreators({ ...input, skip });
    const totalPages = Math.ceil(count / take);
    const hasPrev = pageNumber > 1;
    const hasNext = pageNumber < totalPages;

    const creators = await Promise.all(
      users.map(async (creator) => {
        const { fulfilled, pending, processing, rejected } =
          await this.vaultObjectsRepository.getCountOfObjectsOfEachTypeOfACreator(creator.id);
        return {
          ...creator,
          vaultCount: await this.vaultObjectsRepository.getCreatorTotalVaultObjectsCount(creator.id, input),
          assetCount: await this.creatorAssetsRepository.getCreatorsAssetsCount(creator.id, input),
          fulfilledObjectCount: fulfilled,
          pendingObjectCount: pending,
          processingObjectCount: processing,
          rejectedObjectCount: rejected,
        };
      }),
    );

    return { creators, count, totalPages, hasNext, hasPrev };
  }

  public async getCreatorVaultObjects(input: PaginationInput) {
    const { relatedUserId } = input;

    this.logger.log('by admin');

    if (!relatedUserId) return {} as GetCreatorVaultObjectsOutput;

    const [vaultObjects, count] = await this.vaultObjectsRepository
      .getCreatorVaultObjects(relatedUserId, input)
      .getManyAndCount();

    return { vaultObjects, count };
  }

  public async getCreatorAssets(input: PaginationInput) {
    const { relatedUserId } = input;
    if (!relatedUserId) return [];

    return await this.creatorAssetsRepository.getCreatorAssets(relatedUserId, input);
  }

  public async getAllVaults(input: PaginationInput) {
    const [vaults, count] = await this.vaultObjectsRepository.getAllVaults(input);
    return { vaults, count };
  }

  public async getAllAssets(input: PaginationInput) {
    const [assets, count] = await this.creatorAssetsRepository.getAllAssets(input);
    return { assets, count };
  }

  public async downloadAllCreatorObjects(input: DownloadAllCreatorObjectsAsBatchInput) {
    if (!input.creatorIds.length) return 'failed ';

    this.logger.log({ MESSAGE: 'STARTED DOWNLOADING ALL OBJECTS OF CREATORS', CREATOR_IDS: input.creatorIds });
    try {
      await this.batchUploadVaultQueue.add(input);
    } catch (error) {
      console.log(error.message);
    }
    console.log('Done');

    return 'Downloading is initiated';
  }

  public async handleDownloadAllCreatorObjects(input: DownloadAllCreatorObjectsAsBatchInput) {
    for (const creatorId of input.creatorIds) {
      const objects = await this.vaultObjectsRepository.getTotalPendingObjectsOfACreator(creatorId);
      const vaultObjectIds = objects.map((vaultObject) => vaultObject.id);

      await this.downloaderService.uploadVault(creatorId, {
        destination: AssetType.PRIVATE,
        vaultObjectIds: vaultObjectIds,
      });
    }
  }

  public async downloadCreatorObjectsAsBatch(input: UploadVaultQueueInput) {
    await this.downloaderService.uploadVault(input.creatorId, input);
    return 'Creator batch import has started';
  }

  public async initiateCreatorObjectsImport(input: CreateImportQueueInput) {
    await this.extractorService.initiate(input);
    return 'Creator Objects import started';
  }

  public async terminateDownloading(adminId: string) {
    const exists = await this.usersRepository.isAdmin(adminId);
    if (exists) this.downloaderService.terminateDownloading();

    return 'Downloading is terminated!!!';
  }

  public async updateCreatorProfileByAdmin(adminId: string, input: ExtendedUpdateCreatorProfileInput) {
    return await this.creatorProfilesServices.updateCreatorProfile(input.creatorId, input);
  }

  public async getCreatorProfileByAdmin(adminId: string, creatorId: string) {
    return await this.creatorProfilesServices.getCreatorProfile(creatorId);
  }

  public async cleanUpVaultObjectsOfACreator(adminId: string, creatorId: string) {
    const result = await this.vaultObjectsRepository.cleanUpVaultObjectsOfACreator(creatorId);
    return result.affected;
  }
}
