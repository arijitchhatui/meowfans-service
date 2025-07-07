import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { UserProfilesEntity } from 'src/rdb/entities';
import { FollowCreatorInput } from './dto/follow-creator.dto';
import { UpdateUserProfileInput } from './dto/update-userProfile.dto';
import { UserProfilesService } from './user-profiles.service';
import { UnFollowCreatorInput } from './dto/unfollow-creator.dto';

@Resolver()
export class UserProfilesResolver {
  public constructor(private userProfilesService: UserProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.USER])
  @Query(() => UserProfilesEntity)
  public async getUserProfile(@CurrentUser() @Args('userId') userId: string): Promise<UserProfilesEntity> {
    return await this.userProfilesService.getUserProfile(userId);
  }

  @Auth(GqlAuthGuard, [UserRoles.USER])
  @Mutation(() => UserProfilesEntity)
  public async updateUserProfile(
    @CurrentUser() userId: string,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UserProfilesEntity> {
    return await this.userProfilesService.updateUserProfile(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.USER])
  @Mutation(() => UserProfilesEntity)
  public async followCreator(
    @CurrentUser() userId: string,
    @Args('input') input: FollowCreatorInput,
  ): Promise<UserProfilesEntity> {
    return await this.userProfilesService.followCreator(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.USER])
  @Query(() => UserProfilesEntity)
  public async unFollowCreator(
    @CurrentUser() userId: string,
    @Args('input') input: UnFollowCreatorInput,
  ): Promise<UserProfilesEntity> {
    return await this.userProfilesService.unFollowCreator(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.USER])
  @Query(() => UserProfilesEntity)
  public async getFollowing(@CurrentUser() userId: string): Promise<UserProfilesEntity> {
    return await this.userProfilesService.getFollowing(userId);
  }
}
