import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { CreatorProfilesEntity } from '../postgres/entities';
import { UserRoles } from '../service.constants';
import { CreatorProfilesService } from './creator-profiles.service';
import { UpdateCreatorProfileInput } from './dto';
import { InjectUserToArg } from '@app/decorators';

@Resolver()
export class CreatorProfilesResolver {
  public constructor(private creatorProfilesService: CreatorProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => CreatorProfilesEntity)
  public async getCreatorProfile(@CurrentUser() creatorId: string): Promise<CreatorProfilesEntity> {
    return await this.creatorProfilesService.getCreatorProfile(creatorId);
  }

  @InjectUserToArg('input')
  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => CreatorProfilesEntity)
  public async updateCreatorProfile(
    @CurrentUser() creatorId: string,
    @Args('input') input: UpdateCreatorProfileInput,
  ): Promise<CreatorProfilesEntity> {
    return await this.creatorProfilesService.updateCreatorProfile(creatorId, input);
  }
}
