import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from '../auth';
import { CreatorFollowsEntity, FanProfilesEntity } from '../rdb/entities';
import { GetFollowingInput } from './dto';
import { FollowCreatorInput } from './dto/follow-creator.dto';
import { UnFollowCreatorInput } from './dto/unfollow-creator.dto';
import { UpdateUserProfileInput } from './dto/update-fan-profile.dto';
import { FanProfilesService } from './fan-profiles.service';

@Resolver()
export class FanProfilesResolver {
  public constructor(private userProfilesService: FanProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Query(() => FanProfilesEntity)
  public async getFanProfile(@CurrentUser() fanId: string): Promise<FanProfilesEntity> {
    return await this.userProfilesService.getFanProfile(fanId);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => FanProfilesEntity)
  public async updateFanProfile(
    @CurrentUser() fanId: string,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<FanProfilesEntity> {
    return await this.userProfilesService.updateFanProfile(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => CreatorFollowsEntity)
  public async followCreator(
    @CurrentUser() fanId: string,
    @Args('input') input: FollowCreatorInput,
  ): Promise<CreatorFollowsEntity> {
    return await this.userProfilesService.followCreator(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => Boolean)
  public async unFollowCreator(
    @CurrentUser() fanId: string,
    @Args('input') input: UnFollowCreatorInput,
  ): Promise<boolean> {
    return await this.userProfilesService.unFollowCreator(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Query(() => [CreatorFollowsEntity])
  public async getFollowing(
    @CurrentUser() fanId: string,
    @Args('input') input: GetFollowingInput,
  ): Promise<CreatorFollowsEntity[]> {
    return await this.userProfilesService.getFollowing(fanId, input);
  }
}
