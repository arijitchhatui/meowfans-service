import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  @Query(() => Boolean)
  getUser() {
    return true;
  }
}
