import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../../src/util/enums/user-roles';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { CreatorAssetsEntity } from '../postgres/entities';
import { AssetsService } from './assets.service';
import { DeleteCreatorAsset, GetDefaultAssetsOutput, UpdateAssetsInput } from './dto';

@Resolver()
export class AssetsResolver {
  public constructor(private assetsService: AssetsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deleteCreatorAssets(
    @CurrentUser() creatorId: string,
    @Args('input') input: DeleteCreatorAsset,
  ): Promise<boolean> {
    return await this.assetsService.deleteCreatorAssets(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorAssetsEntity])
  public async getCreatorAssets(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<CreatorAssetsEntity[]> {
    return await this.assetsService.getCreatorAssets(creatorId, input);
  }

  @Query(() => GetDefaultAssetsOutput)
  public async getDefaultAssets(@Args('input') input: PaginationInput): Promise<GetDefaultAssetsOutput> {
    return await this.assetsService.getDefaultAssets(input);
  }

  @Query(() => [CreatorAssetsEntity])
  public async getDefaultCreatorAssets(@Args('input') input: PaginationInput): Promise<CreatorAssetsEntity[]> {
    return await this.assetsService.getDefaultCreatorAssets(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => [CreatorAssetsEntity])
  public async updateAssets(
    @CurrentUser() creatorId: string,
    @Args('input') input: UpdateAssetsInput,
  ): Promise<CreatorAssetsEntity[]> {
    return await this.assetsService.updateAssets(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deleteAllAssets(@CurrentUser() creatorId: string): Promise<boolean> {
    return await this.assetsService.deleteAllAssets(creatorId);
  }
}
