import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from '../auth';
import { AssetsEntity, CreatorAssetsEntity } from '../rdb/entities';
import { AssetsService } from './assets.service';
import { DeleteCreatorAsset, GetCreatorAssetsInput } from './dto';
import { CreateAssetInput } from './dto/create-asset.dto';

@Resolver()
export class AssetsResolver {
  public constructor(private assetsService: AssetsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deleteCreatorAsset(
    @CurrentUser() creatorId: string,
    @Args('input') input: DeleteCreatorAsset,
  ): Promise<boolean> {
    return this.assetsService.deleteCreatorAsset(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => AssetsEntity)
  public async createAsset(
    @CurrentUser() creatorId: string,
    @Args('input') input: CreateAssetInput,
  ): Promise<AssetsEntity> {
    return await this.assetsService.createAsset(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorAssetsEntity])
  public async getCreatorAssets(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetCreatorAssetsInput,
  ): Promise<CreatorAssetsEntity[]> {
    return await this.assetsService.getCreatorAssets(creatorId, input);
  }
}
