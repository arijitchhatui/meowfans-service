import { PaginationInput } from '@app/helpers';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { UserRoles } from '../service.constants';
import { GetCommentsOutput } from './dto';
import { PostCommentsService } from './post-comments.service';

@Resolver()
export class PostCommentsResolver {
  public constructor(private postCommentsService: PostCommentsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetCommentsOutput])
  public async getPostCommentsByPostId(@CurrentUser() creatorId: string, @Args('input') input: PaginationInput) {
    return await this.postCommentsService.getPostCommentsByPostId(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetCommentsOutput])
  public async getAllComments(@CurrentUser() creatorId: string, @Args('input') input: PaginationInput) {
    return await this.postCommentsService.getAllComments(creatorId, input);
  }
}
