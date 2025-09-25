import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { UsersEntity } from '../postgres/entities';
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
}
