import { PaginationInput } from '@app/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { AssetType } from '../../util/enums';
import { DownloadStates } from '../../util/enums/download-state';
import { CreatorProfilesService, ExtendedUpdateCreatorProfileInput, GetAllCreatorsOutput } from '../creator-profiles';
import { DownloaderService } from '../downloader/downloader.service';
import { UploadVaultQueueInput } from '../downloader/dto';
import { ExtractorService } from '../extractor/extractor.service';
import { CreateImportQueueInput } from '../import/dto';
import { CreatorAssetsRepository, UsersRepository, VaultsObjectsRepository } from '../postgres/repositories';
import { GetCreatorVaultObjectsOutput } from '../vaults/dto';

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
  ) {}

  public async getAllCreators(input: PaginationInput): Promise<GetAllCreatorsOutput> {
    const [users, count] = await this.usersRepository.getAllCreators(input);

    const creators = await Promise.all(
      users.map(async (creator) => {
        return {
          ...creator,
          vaultCount: await this.vaultObjectsRepository.getCreatorTotalVaultObjectsCount(creator.id, input),
          assetCount: await this.creatorAssetsRepository.getCreatorsAssetsCount(creator.id, input),
          fulfilledObjectCount: await this.vaultObjectsRepository.getTotalStatsOfObjectsOfACreator(
            creator.id,
            DownloadStates.FULFILLED,
          ),
          pendingObjectCount: await this.vaultObjectsRepository.getTotalStatsOfObjectsOfACreator(
            creator.id,
            DownloadStates.PENDING,
          ),
          processingObjectCount: await this.vaultObjectsRepository.getTotalStatsOfObjectsOfACreator(
            creator.id,
            DownloadStates.PROCESSING,
          ),
          rejectedObjectCount: await this.vaultObjectsRepository.getTotalStatsOfObjectsOfACreator(
            creator.id,
            DownloadStates.REJECTED,
          ),
        };
      }),
    );

    return { creators, count };
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

  public async downloadAllCreatorObjects(input: PaginationInput) {
    if (!input.relatedUserId) return;

    this.logger.log({ MESSAGE: 'STARTED DOWNLOADING ALL OBJECTS OF A CREATOR', CREATOR_ID: input.relatedUserId });

    const objects = await this.vaultObjectsRepository.getTotalPendingObjectsOfACreator(input.relatedUserId);
    const vaultObjectIds = objects.map((vaultObject) => vaultObject.id);

    await this.downloaderService.uploadVault(input.relatedUserId, {
      destination: AssetType.PRIVATE,
      vaultObjectIds: vaultObjectIds,
    });
    return 'Downloading is initiated';
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
}
