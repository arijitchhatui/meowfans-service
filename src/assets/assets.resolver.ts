import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
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
}
