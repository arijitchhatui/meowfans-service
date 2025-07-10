import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { PostCommentsEntity, PostsEntity } from 'src/rdb/entities';
import {
  CreateCommentInput,
  CreatePostInput,
  DeleteCommentInput,
  DeletePostInput,
  DeleteSharePostInput,
  GetPostInput,
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

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.ADMIN])
  @Mutation(() => PostsEntity)
  public async createComment(
    @CurrentUser() userId: string,
    @Args('input') input: CreateCommentInput,
  ): Promise<PostsEntity> {
    return this.postsService.createComment(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.USER])
  @Mutation(() => PostCommentsEntity)
  public async updateComment(
    @CurrentUser() userId: string,
    @Args('input') input: UpdateCommentInput,
  ): Promise<PostCommentsEntity> {
    return this.postsService.updateComment(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.USER])
  @Mutation(() => Boolean)
  public async deleteComment(
    @CurrentUser() userId: string,
    @Args('input') input: DeleteCommentInput,
  ): Promise<boolean> {
    return this.postsService.deleteComment(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.USER])
  @Mutation(() => PostsEntity)
  public async likePost(@CurrentUser() userId: string, @Args('input') input: LikePostInput): Promise<PostsEntity> {
    return await this.likePost(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.USER])
  @Mutation(() => PostsEntity)
  public async sharePost(@CurrentUser() userId: string, @Args('input') input: LikePostInput): Promise<PostsEntity> {
    return await this.sharePost(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.USER])
  @Mutation(() => Boolean)
  public async deleteShare(
    @CurrentUser() userId: string,
    @Args('input') input: DeleteSharePostInput,
  ): Promise<boolean> {
    return await this.deleteShare(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.USER])
  @Mutation(() => PostsEntity)
  public async savePost(@CurrentUser() userId: string, @Args('input') input: SavePostInput): Promise<PostsEntity> {
    return await this.savePost(userId, input);
  }
}
