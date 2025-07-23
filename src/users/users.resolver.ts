import { Mutation, Resolver } from '@nestjs/graphql';
import { Auth, GqlAuthGuard } from '../auth';
import { UsersEntity } from '../rdb/entities';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Auth(GqlAuthGuard, [])
  @Mutation(() => [UsersEntity])
  public async migrate() {
    return await this.usersService.migrate();
  }
}
