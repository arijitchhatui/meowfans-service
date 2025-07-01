import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from 'src/auth';
import { UserProfilesEntity } from 'src/rdb/entities';
import { UpdateUserInput } from './dto';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Auth(GqlAuthGuard, [])
  @Query(() => UserProfilesEntity)
  public getUserProfile(@Args('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Auth(GqlAuthGuard, [])
  @Mutation(() => UserProfilesEntity)
  public updateUserProfile(@CurrentUser() userId: string, @Args('input') input: UpdateUserInput) {
    return this.usersService.updateUserProfile(userId, input);
  }
}
