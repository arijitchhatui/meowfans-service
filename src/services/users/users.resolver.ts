import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { GetDefaultCreatorsOutput } from '../creator-profiles';
import { UsersEntity } from '../postgres/entities';
import { UpdateUsersInput } from './dto';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Auth(GqlAuthGuard, [])
  @Mutation(() => Boolean)
  public async deleteUser(@CurrentUser() userId: string): Promise<boolean> {
    return await this.usersService.deleteUser(userId);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN, UserRoles.CREATOR, UserRoles.FAN])
  @Query(() => UsersEntity)
  public async getUser(@Args('username') username: string): Promise<UsersEntity> {
    return await this.usersService.getUser(username);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => String)
  public async updateAllCreatorProfiles(@CurrentUser() adminId: string, @Args('input') input: UpdateUsersInput) {
    return await this.usersService.updateAllCreatorProfiles(input);
  }

  @Query(() => GetDefaultCreatorsOutput)
  public async getDefaultCreators(@Args('input') input: PaginationInput): Promise<GetDefaultCreatorsOutput> {
    return await this.usersService.getDefaultCreators(input);
  }
}
