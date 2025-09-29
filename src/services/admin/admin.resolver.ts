import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { GetAllAssetsOutput } from '../assets';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { ExtendedUpdateCreatorProfileInput, GetAllCreatorsOutput } from '../creator-profiles';
import { UploadVaultQueueInput } from '../downloader/dto';
import { CreateImportQueueInput } from '../import/dto';
import { CreatorAssetsEntity, CreatorProfilesEntity } from '../postgres/entities';
import { CleanUpVaultInput, GetAllVaultsOutput, GetCreatorVaultObjectsOutput } from '../vaults/dto';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Query(() => GetAllCreatorsOutput)
  public async getCreatorsByAdmin(@Args('input') input: PaginationInput): Promise<GetAllCreatorsOutput> {
    return await this.adminService.getAllCreators(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Query(() => [CreatorAssetsEntity])
  public async getCreatorAssetsByAdmin(@Args('input') input: PaginationInput): Promise<CreatorAssetsEntity[]> {
    return await this.adminService.getCreatorAssets(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Query(() => GetCreatorVaultObjectsOutput)
  public async getCreatorVaultObjectsByAdmin(
    @Args('input') input: PaginationInput,
  ): Promise<GetCreatorVaultObjectsOutput> {
    return await this.adminService.getCreatorVaultObjects(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Query(() => GetAllAssetsOutput)
  public async getAllAssetsByAdmin(@Args('input') input: PaginationInput): Promise<GetAllAssetsOutput> {
    return await this.adminService.getAllAssets(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Query(() => GetAllVaultsOutput)
  public async getAllVaultsByAdmin(@Args('input') input: PaginationInput): Promise<GetAllVaultsOutput> {
    return await this.adminService.getAllVaults(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Query(() => CreatorProfilesEntity)
  public async getCreatorProfileByAdmin(
    @CurrentUser() adminId: string,
    @Args('creatorId') creatorId: string,
  ): Promise<CreatorProfilesEntity> {
    return await this.adminService.getCreatorProfileByAdmin(adminId, creatorId);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => String)
  public async downloadAllCreatorObjects(@Args('input') input: PaginationInput) {
    return await this.adminService.downloadAllCreatorObjects(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => String)
  public async downloadCreatorObjectsAsBatch(@Args('input') input: UploadVaultQueueInput) {
    return await this.adminService.downloadCreatorObjectsAsBatch(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => String)
  public async initiateCreatorObjectsImport(@Args('input') input: CreateImportQueueInput) {
    return await this.adminService.initiateCreatorObjectsImport(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => String)
  public async terminateDownloading(@CurrentUser() adminId: string) {
    return await this.adminService.terminateDownloading(adminId);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => CreatorProfilesEntity)
  public async updateCreatorProfileByAdmin(
    @CurrentUser() adminId: string,
    @Args('input') input: ExtendedUpdateCreatorProfileInput,
  ) {
    return await this.adminService.updateCreatorProfileByAdmin(adminId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => Number)
  public async cleanUpVaultObjectsOfACreator(@CurrentUser() adminId: string, @Args('input') input: CleanUpVaultInput) {
    return await this.adminService.cleanUpVaultObjectsOfACreator(adminId, input.creatorId);
  }
}
