import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { PostCommentsEntity } from 'src/rdb/entities';
import { GetAllCommentsInput, GetPostCommentsInput } from './dto';
import { PostCommentsService } from './post-comments.service';

@Resolver()
export class PostCommentsResolver {
  public constructor(private postCommentsService: PostCommentsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [PostCommentsEntity])
  public async getPostCommentsByPostId(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetPostCommentsInput,
  ): Promise<PostCommentsEntity[]> {
    return await this.postCommentsService.getPostCommentsByPostId(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [PostCommentsEntity])
  public async getAllComments(
    @CurrentUser() creatorId: string,
    input: GetAllCommentsInput,
  ): Promise<PostCommentsEntity[]> {
    return await this.postCommentsService.getAllComments(creatorId, input);
  }
}
