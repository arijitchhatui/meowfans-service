import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../../lib/helpers';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { GetRestrictedUsersOutput, RestrictFanInput } from '../creator-profiles';
import { UserRoles } from '../service.constants';
import { CreatorRestrictsService } from './creator-restricts.service';

@Resolver()
export class CreatorRestrictsResolver {
  public constructor(private creatorRestrictsService: CreatorRestrictsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetRestrictedUsersOutput])
  public async getRestrictedUsers(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<GetRestrictedUsersOutput[]> {
    return await this.creatorRestrictsService.getRestrictedUsers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async restrictFan(@CurrentUser() creatorId: string, @Args('input') input: RestrictFanInput): Promise<boolean> {
    return await this.creatorRestrictsService.restrictFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async unRestrictFan(
    @CurrentUser() creatorId: string,
    @Args('input') input: RestrictFanInput,
  ): Promise<boolean> {
    return await this.creatorRestrictsService.unRestrictFan(creatorId, input);
  }
}
