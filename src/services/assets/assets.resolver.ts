import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'libs/enums/user-roles';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { CreatorAssetsEntity } from '../postgres/entities';
import { AssetsService } from './assets.service';
import { DeleteCreatorAsset } from './dto';

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
  @Query(() => [CreatorAssetsEntity])
  public async getCreatorAssets(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<CreatorAssetsEntity[]> {
    return await this.assetsService.getCreatorAssets(creatorId, input);
  }
}
