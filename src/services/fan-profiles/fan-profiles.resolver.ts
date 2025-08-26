import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectUserToArg } from '../../lib';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { FanProfilesEntity } from '../postgres/entities';
import { UserRoles } from '../service.constants';
import { UpdateUserProfileInput } from './dto';
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
}
