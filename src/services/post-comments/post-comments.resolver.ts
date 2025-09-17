import { PaginationInput } from '@app/helpers';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'libs/enums/user-roles';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { PostCommentsEntity } from '../postgres/entities';
import { PostCommentsService } from './post-comments.service';

@Resolver()
export class PostCommentsResolver {
  public constructor(private postCommentsService: PostCommentsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [PostCommentsEntity])
  public async getPostCommentsByPostId(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<PostCommentsEntity[]> {
    return await this.postCommentsService.getPostCommentsByPostId(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [PostCommentsEntity])
  public async getAllComments(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<PostCommentsEntity[]> {
    return await this.postCommentsService.getAllComments(creatorId, input);
  }
}
