import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { UserProfilesEntity } from 'src/rdb/entities';
import { UserProfilesService } from './user-profiles.service';

@Resolver()
export class UserProfilesResolver {
  public constructor(private userProfilesService: UserProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.USER])
  @Query(() => UserProfilesEntity)
  public getUserProfile(@CurrentUser() @Args('userId') userId: string) {
    return this.userProfilesService.getUserProfile(userId);
  }
}
