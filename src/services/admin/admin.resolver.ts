import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { GetAllAssetsOutput } from '../assets';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { GetAllCreatorsOutput } from '../creator-profiles';
import { CreatorAssetsEntity } from '../postgres/entities';
import { GetAllVaultsOutput, GetCreatorVaultObjectsOutput } from '../vaults/dto';
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
  @Mutation(() => String)
  public async downloadAllCreatorObjects(@Args('input') input: PaginationInput) {
    return await this.adminService.downloadAllCreatorObjects(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => String)
  public async terminateDownloading(@CurrentUser() adminId: string) {
    return await this.adminService.terminateDownloading(adminId);
  }
}
