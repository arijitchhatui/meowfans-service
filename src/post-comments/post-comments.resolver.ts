import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { GetAllCommentsInput, GetCommentsOutput, GetPostCommentsInput } from './dto';
import { PostCommentsService } from './post-comments.service';

@Resolver()
export class PostCommentsResolver {
  public constructor(private postCommentsService: PostCommentsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetCommentsOutput])
  public async getPostCommentsByPostId(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetPostCommentsInput,
  ): Promise<GetCommentsOutput[]> {
    return await this.postCommentsService.getPostCommentsByPostId(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetCommentsOutput])
  public async getAllComments(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetAllCommentsInput,
  ): Promise<GetCommentsOutput[]> {
    return await this.postCommentsService.getAllComments(creatorId, input);
  }
}
