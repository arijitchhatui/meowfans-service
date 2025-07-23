import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from '../auth';
import {
  CreatorBlocksEntity,
  CreatorFollowsEntity,
  CreatorProfilesEntity,
  CreatorRestrictsEntity,
} from '../rdb/entities';
import { CreatorProfilesService } from './creator-profiles.service';
import {
  BlockFanInput,
  DeleteFollowerInput,
  GetBlockedUsersInput,
  GetFollowersInput,
  GetRestrictedUsersInput,
  UpdateCreatorProfileInput,
} from './dto';
import { RestrictFanInput } from './dto/restrict-fan.dto';

@Resolver()
export class CreatorProfilesResolver {
  public constructor(private creatorProfilesService: CreatorProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => CreatorProfilesEntity)
  public async getCreatorProfile(@CurrentUser() creatorId: string): Promise<CreatorProfilesEntity> {
    return await this.creatorProfilesService.getCreatorProfile(creatorId);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => CreatorProfilesEntity)
  public async updateCreatorProfile(
    @CurrentUser() creatorId: string,
    @Args('input') input: UpdateCreatorProfileInput,
  ): Promise<CreatorProfilesEntity> {
    return await this.creatorProfilesService.updateCreatorProfile(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deleteFollower(
    @CurrentUser() creatorId: string,
    @Args('input') input: DeleteFollowerInput,
  ): Promise<boolean> {
    return await this.creatorProfilesService.deleteFollower(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorFollowsEntity])
  public async getFollowers(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetFollowersInput,
  ): Promise<CreatorFollowsEntity[]> {
    return await this.creatorProfilesService.getFollowers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorBlocksEntity])
  public async getBlockedUsers(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetBlockedUsersInput,
  ): Promise<CreatorBlocksEntity[]> {
    return await this.creatorProfilesService.getBlockedUsers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async blockFan(@CurrentUser() creatorId: string, @Args('input') input: BlockFanInput): Promise<boolean> {
    return await this.creatorProfilesService.blockFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async unBlockFan(@CurrentUser() creatorId: string, @Args('input') input: BlockFanInput): Promise<boolean> {
    return await this.creatorProfilesService.unBlockFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorRestrictsEntity])
  public async getRestrictedUsers(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetRestrictedUsersInput,
  ): Promise<CreatorRestrictsEntity[]> {
    return await this.creatorProfilesService.getRestrictedUsers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async restrictFan(@CurrentUser() creatorId: string, @Args('input') input: RestrictFanInput): Promise<boolean> {
    return await this.creatorProfilesService.restrictFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async unRestrictFan(
    @CurrentUser() creatorId: string,
    @Args('input') input: RestrictFanInput,
  ): Promise<boolean> {
    return await this.creatorProfilesService.unRestrictFan(creatorId, input);
  }
}
