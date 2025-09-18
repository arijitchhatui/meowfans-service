import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { RestrictFanInput } from '../creator-profiles';
import { CreatorRestrictsEntity } from '../postgres/entities';
import { CreatorRestrictsService } from './creator-restricts.service';
import { UserRoles } from '../../util/enums';

@Resolver()
export class CreatorRestrictsResolver {
  public constructor(private creatorRestrictsService: CreatorRestrictsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [CreatorRestrictsEntity])
  public async getRestrictedUsers(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<CreatorRestrictsEntity[]> {
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
