import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { PostCommentsEntity, PostsEntity, PostSharesEntity } from 'src/rdb/entities';
import {
  CreateCommentInput,
  CreatePostInput,
  DeleteCommentInput,
  DeletePostInput,
  DeletePostsInput,
  DeleteSharePostInput,
  GetPostInput,
  GetPostsInfoInput,
  GetPostsInfoOutput,
  LikePostInput,
  SavePostInput,
  UpdateCommentInput,
  UpdatePostInput,
} from './dto';
import { PostsService } from './posts.service';

@Resolver()
export class PostsResolver {
  public constructor(private postsService: PostsService) {}

  @Auth(GqlAuthGuard, [])
  @Query(() => [PostsEntity])
  public async getPosts(@CurrentUser() creatorId: string): Promise<PostsEntity[]> {
    return this.postsService.getPosts(creatorId);
  }

  @Auth(GqlAuthGuard, [])
  @Query(() => PostsEntity)
  public async getPost(@Args('input') creatorId: string, @Args('input') input: GetPostInput): Promise<PostsEntity> {
    return this.postsService.getPost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => PostsEntity)
  public async createPost(
    @CurrentUser() creatorId: string,
    @Args('input') input: CreatePostInput,
  ): Promise<PostsEntity> {
    return this.postsService.createPost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => PostsEntity)
  public async updatePost(
    @CurrentUser() creatorId: string,
    @Args('input') input: UpdatePostInput,
  ): Promise<PostsEntity> {
    return this.postsService.updatePost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deletePost(@CurrentUser() creatorId: string, @Args('input') input: DeletePostInput): Promise<boolean> {
    return this.postsService.deletePost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => PostCommentsEntity)
  public async createComment(
    @CurrentUser() fanId: string,
    @Args('input') input: CreateCommentInput,
  ): Promise<PostCommentsEntity> {
    return this.postsService.createComment(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => PostCommentsEntity)
  public async updateComment(
    @CurrentUser() fanId: string,
    @Args('input') input: UpdateCommentInput,
  ): Promise<PostCommentsEntity> {
    return this.postsService.updateComment(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => Boolean)
  public async deleteComment(@CurrentUser() fanId: string, @Args('input') input: DeleteCommentInput): Promise<boolean> {
    return this.postsService.deleteComment(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => PostsEntity)
  public async likePost(@CurrentUser() fanId: string, @Args('input') input: LikePostInput): Promise<PostsEntity> {
    return await this.postsService.likePost(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => PostSharesEntity)
  public async sharePost(@CurrentUser() fanId: string, @Args('input') input: LikePostInput): Promise<PostSharesEntity> {
    return await this.postsService.sharePost(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => Boolean)
  public async deleteShare(@CurrentUser() fanId: string, @Args('input') input: DeleteSharePostInput): Promise<boolean> {
    return await this.postsService.deleteShare(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => PostsEntity)
  public async savePost(@CurrentUser() fanId: string, @Args('input') input: SavePostInput): Promise<PostsEntity> {
    return await this.postsService.savePost(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deletePosts(@CurrentUser() creatorId: string, @Args('input') input: DeletePostsInput): Promise<boolean> {
    return await this.postsService.deletePosts(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetPostsInfoOutput])
  public async getPostsInfo(
    @CurrentUser() creatorId: string,
    @Args('input') input: GetPostsInfoInput,
  ): Promise<GetPostsInfoOutput[]> {
    return await this.postsService.getPostsInfo(creatorId, input);
  }
}
