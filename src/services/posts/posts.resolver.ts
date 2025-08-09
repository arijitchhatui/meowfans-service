import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../../lib/helpers';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { PostCommentsEntity, PostsEntity, PostSharesEntity } from '../rdb/entities';
import { UserRoles } from '../service.constants';
import {
  CreateCommentInput,
  CreatePostInput,
  DeleteCommentInput,
  DeletePostInput,
  DeletePostsInput,
  DeleteSharePostInput,
  GetPostsInfoOutput,
  LikePostInput,
  SavePostInput,
  UpdateCommentInput,
  UpdatePostInput,
} from './dto';
import { GetPostsOutput } from './dto/get-posts.out.dto';
import { PostsService } from './posts.service';

@Resolver()
export class PostsResolver {
  public constructor(private postsService: PostsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [GetPostsOutput])
  public async getPosts(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<GetPostsOutput[]> {
    return await this.postsService.getPosts(creatorId, input);
  }

  @Auth(GqlAuthGuard, [])
  @Query(() => PostsEntity)
  public async getPost(@CurrentUser() creatorId: string, @Args('input') input: PaginationInput): Promise<PostsEntity> {
    return await this.postsService.getPost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => PostsEntity)
  public async createPost(
    @CurrentUser() creatorId: string,
    @Args('input') input: CreatePostInput,
  ): Promise<PostsEntity> {
    return await this.postsService.createPost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => PostsEntity)
  public async updatePost(
    @CurrentUser() creatorId: string,
    @Args('input') input: UpdatePostInput,
  ): Promise<PostsEntity> {
    return await this.postsService.updatePost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => Boolean)
  public async deletePost(@CurrentUser() creatorId: string, @Args('input') input: DeletePostInput): Promise<boolean> {
    return await this.postsService.deletePost(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN, UserRoles.CREATOR])
  @Mutation(() => PostCommentsEntity)
  public async createComment(
    @CurrentUser() fanId: string,
    @Args('input') input: CreateCommentInput,
  ): Promise<PostCommentsEntity> {
    return await this.postsService.createComment(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => PostCommentsEntity)
  public async updateComment(
    @CurrentUser() fanId: string,
    @Args('input') input: UpdateCommentInput,
  ): Promise<PostCommentsEntity> {
    return await this.postsService.updateComment(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => Boolean)
  public async deleteComment(@CurrentUser() fanId: string, @Args('input') input: DeleteCommentInput): Promise<boolean> {
    return await this.postsService.deleteComment(fanId, input);
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
    @Args('input') input: PaginationInput,
  ): Promise<GetPostsInfoOutput[]> {
    return await this.postsService.getPostsInfo(creatorId, input);
  }
}
