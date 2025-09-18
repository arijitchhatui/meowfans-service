import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { DeleteFollowerInput } from '../creator-profiles';
import { FollowCreatorInput, UnFollowCreatorInput } from '../fan-profiles';
import { CreatorFollowsEntity } from '../postgres/entities';
import { CreatorFollowsService } from './creator-follows.service';
import { UserRoles } from '../../util/enums';

@Resolver()
export class CreatorFollowsResolver {
  public constructor(private creatorFollowsService: CreatorFollowsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deleteFollower(
    @CurrentUser() creatorId: string,
    @Args('input') input: DeleteFollowerInput,
  ): Promise<boolean> {
    return await this.creatorFollowsService.deleteFollower(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorFollowsEntity])
  public async getFollowers(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<CreatorFollowsEntity[]> {
    return await this.creatorFollowsService.getFollowers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => CreatorFollowsEntity)
  public async followCreator(
    @CurrentUser() fanId: string,
    @Args('input') input: FollowCreatorInput,
  ): Promise<CreatorFollowsEntity> {
    return await this.creatorFollowsService.followCreator(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => Boolean)
  public async unFollowCreator(
    @CurrentUser() fanId: string,
    @Args('input') input: UnFollowCreatorInput,
  ): Promise<boolean> {
    return await this.creatorFollowsService.unFollowCreator(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Query(() => [CreatorFollowsEntity])
  public async getFollowing(
    @CurrentUser() fanId: string,
    @Args('input') input: PaginationInput,
  ): Promise<CreatorFollowsEntity[]> {
    return await this.creatorFollowsService.getFollowing(fanId, input);
  }
}
