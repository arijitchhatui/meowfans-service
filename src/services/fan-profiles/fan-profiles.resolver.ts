import { InjectUserToArg } from '@app/decorators';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { FanProfilesEntity } from '../postgres/entities';
import { UpdateUserProfileInput } from './dto';
import { FanProfilesService } from './fan-profiles.service';
import { UserRoles } from '../../util/enums';

@Resolver()
export class FanProfilesResolver {
  public constructor(private fanProfilesService: FanProfilesService) {}

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Query(() => FanProfilesEntity)
  public async getFanProfile(@CurrentUser() fanId: string): Promise<FanProfilesEntity> {
    return await this.fanProfilesService.getFanProfile(fanId);
  }

  @InjectUserToArg('input')
  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => FanProfilesEntity)
  public async updateFanProfile(
    @CurrentUser() fanId: string,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<FanProfilesEntity> {
    return await this.fanProfilesService.updateFanProfile(fanId, input);
  }
}
