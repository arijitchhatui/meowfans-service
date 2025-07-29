import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectUserToArg } from '../../lib';
import { PaginationInput } from '../../lib/helpers';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { GetFollowingUsersOutput } from '../creator-profiles';
import { FanProfilesEntity } from '../rdb/entities';
import { UserRoles } from '../service.constants';
import { FollowCreatorInput, UnFollowCreatorInput, UpdateUserProfileInput } from './dto';
import { FanProfilesService } from './fan-profiles.service';

@Resolver()
export class FanProfilesResolver {
  public constructor(private userProfilesService: FanProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Query(() => FanProfilesEntity)
  public async getFanProfile(@CurrentUser() fanId: string): Promise<FanProfilesEntity> {
    return await this.userProfilesService.getFanProfile(fanId);
  }

  @InjectUserToArg('input')
  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => FanProfilesEntity)
  public async updateFanProfile(
    @CurrentUser() fanId: string,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<FanProfilesEntity> {
    return await this.userProfilesService.updateFanProfile(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => Boolean)
  public async followCreator(@CurrentUser() fanId: string, @Args('input') input: FollowCreatorInput): Promise<boolean> {
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
  @Query(() => [GetFollowingUsersOutput])
  public async getFollowing(
    @CurrentUser() fanId: string,
    @Args('input') input: PaginationInput,
  ): Promise<GetFollowingUsersOutput[]> {
    return await this.userProfilesService.getFollowing(fanId, input);
  }
}
