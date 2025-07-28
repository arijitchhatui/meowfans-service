import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectUserToArg } from '../../lib';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { CreatorProfilesEntity } from '../rdb/entities';
import { UserRoles } from '../service.constants';
import { CreatorProfilesService } from './creator-profiles.service';
import {
  BlockFanInput,
  DeleteFollowerInput,
  GetBlockedUsersOutput,
  GetFollowedUsersOutput,
  GetRestrictedUsersOutput,
  UpdateCreatorProfileInput,
} from './dto';
import { RestrictFanInput } from './dto/restrict-fan.dto';
import { PaginationInput } from '../../lib/helpers';

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

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deleteFollower(
    @CurrentUser() creatorId: string,
    @Args('input') input: DeleteFollowerInput,
  ): Promise<boolean> {
    return await this.creatorProfilesService.deleteFollower(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetFollowedUsersOutput])
  public async getFollowers(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<GetFollowedUsersOutput[]> {
    return await this.creatorProfilesService.getFollowers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetBlockedUsersOutput])
  public async getBlockedUsers(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<GetBlockedUsersOutput[]> {
    return await this.creatorProfilesService.getBlockedUsers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async blockFan(@CurrentUser() creatorId: string, @Args('input') input: BlockFanInput): Promise<boolean> {
    return await this.creatorProfilesService.blockFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async unBlockFan(@CurrentUser() creatorId: string, @Args('input') input: BlockFanInput): Promise<boolean> {
    return await this.creatorProfilesService.unBlockFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetRestrictedUsersOutput])
  public async getRestrictedUsers(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<GetRestrictedUsersOutput[]> {
    return await this.creatorProfilesService.getRestrictedUsers(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async restrictFan(@CurrentUser() creatorId: string, @Args('input') input: RestrictFanInput): Promise<boolean> {
    return await this.creatorProfilesService.restrictFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async unRestrictFan(
    @CurrentUser() creatorId: string,
    @Args('input') input: RestrictFanInput,
  ): Promise<boolean> {
    return await this.creatorProfilesService.unRestrictFan(creatorId, input);
  }
}
