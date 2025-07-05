import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { CreatorProfilesEntity } from 'src/rdb/entities';
import { CreatorProfilesService } from './creator-profiles.service';

@Resolver()
export class CreatorProfilesResolver {
  public constructor(private creatorProfilesService: CreatorProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => CreatorProfilesEntity)
  public getCreatorProfile(@CurrentUser() @Args('creatorId') creatorId: string) {
    return this.creatorProfilesService.getCreatorProfile(creatorId);
  }
}
