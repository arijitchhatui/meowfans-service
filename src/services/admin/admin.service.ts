import { PaginationInput } from '@app/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { AssetType } from '../../util/enums';
import { GetAllCreatorsOutput } from '../creator-profiles';
import { DownloaderService } from '../downloader/downloader.service';
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
  ) {}

  public async getAllCreators(input: PaginationInput): Promise<GetAllCreatorsOutput> {
    const [users, count] = await this.usersRepository.getAllCreators(input);

    const creators = await Promise.all(
      users.map(async (creator) => {
        return {
          ...creator,
          vaultCount: await this.vaultObjectsRepository.getCreatorTotalVaultObjectsCount(creator.id, input),
          assetCount: await this.creatorAssetsRepository.getCreatorsAssetsCount(creator.id, input),
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

  public async terminateDownloading(adminId: string) {
    const exists = await this.usersRepository.isAdmin(adminId);
    if (exists) this.downloaderService.terminateDownloading();

    return 'Downloading is terminated!!!';
  }
}
