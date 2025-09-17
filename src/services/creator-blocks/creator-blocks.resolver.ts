import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'libs/enums/user-roles';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { BlockFanInput } from '../creator-profiles';
import { CreatorBlocksEntity } from '../postgres/entities';
import { CreatorBlocksService } from './creator-blocks.service';

@Resolver()
export class CreatorBlocksResolver {
  public constructor(private creatorBlocksService: CreatorBlocksService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorBlocksEntity])
  public async getBlockedUsers(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<CreatorBlocksEntity[]> {
    return await this.creatorBlocksService.getBlockedUsers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async blockFan(@CurrentUser() creatorId: string, @Args('input') input: BlockFanInput): Promise<boolean> {
    return await this.creatorBlocksService.blockFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async unBlockFan(@CurrentUser() creatorId: string, @Args('input') input: BlockFanInput): Promise<boolean> {
    return await this.creatorBlocksService.unBlockFan(creatorId, input);
  }
}
