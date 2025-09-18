import { Mutation, Resolver } from '@nestjs/graphql';
import { Auth, GqlAuthGuard } from '../auth';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Auth(GqlAuthGuard, [])
  @Mutation(() => Boolean)
  public async deleteUser(userId: string): Promise<boolean> {
    return await this.usersService.deleteUser(userId);
  }
}
