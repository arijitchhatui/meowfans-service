import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, GqlAuthGuard } from 'src/auth';
import { UserProfilesEntity } from 'src/rdb/entities';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Auth(GqlAuthGuard, [])
  @Query(() => UserProfilesEntity)
  public getUserProfile(@Args('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }
}
