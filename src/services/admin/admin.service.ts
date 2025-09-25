import { PaginationInput } from '@app/helpers';
import { Injectable } from '@nestjs/common';
import { AssetType } from '../../util/enums';
import { DownloaderService } from '../downloader/downloader.service';
import { CreatorAssetsRepository, UsersRepository, VaultsObjectsRepository } from '../postgres/repositories';
import { GetCreatorVaultObjectsOutput } from '../vaults/dto';

@Injectable()
export class AdminService {
  private isTerminated = false;

  constructor(
    private downloaderService: DownloaderService,
    private usersRepository: UsersRepository,
    private vaultObjectsRepository: VaultsObjectsRepository,
    private creatorAssetsRepository: CreatorAssetsRepository,
  ) {}

  public async getAllCreators(input: PaginationInput) {
    const [creators, count] = await this.usersRepository.getAllCreators(input);
    return { creators, count };
  }

  public async getCreatorVaultObjects(input: PaginationInput) {
    const { relatedUserId } = input;
    if (!relatedUserId) return {} as GetCreatorVaultObjectsOutput;

    const creatorVaultObject = await this.vaultObjectsRepository.getCreatorVaultObjects(relatedUserId, input);

    const [vaultObjects, count] = await creatorVaultObject.getManyAndCount();
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

    const objects = await this.vaultObjectsRepository.getTotalObjects(input.relatedUserId, input);
    const vaultObjectIds = objects.map((vaultObject) => vaultObject.id);

    await this.downloaderService.uploadVault(input.relatedUserId, {
      destination: AssetType.PRIVATE,
      vaultObjectIds: vaultObjectIds,
    });
  }

  public async terminateDownloading(adminId: string) {
    const exists = await this.usersRepository.isAdmin(adminId);
    if (exists) this.downloaderService.terminateDownloading();

    return 'Stopped downloading';
  }
}
