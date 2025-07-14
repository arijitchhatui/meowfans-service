import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import {
  CreatorProfilesRepository,
  PostAssetsRepository,
  PostCommentsRepository,
  PostLikesRepository,
  PostSavesRepository,
  PostSharesRepository,
  PostsRepository,
} from 'src/rdb/repositories';
import {
  CreateCommentInput,
  DeleteCommentInput,
  DeletePostInput,
  DeletePostsInput,
  DeleteSharePostInput,
  GetPostInput,
  GetPostsInfoInput,
  LikePostInput,
  SavePostInput,
  SharePostInput,
  UpdateCommentInput,
  UpdatePostInput,
} from './dto';
import { CreatePostInput } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  public constructor(
    private creatorProfilesRepository: CreatorProfilesRepository,
    private postCommentsRepository: PostCommentsRepository,
    private postAssetsRepository: PostAssetsRepository,
    private postSharesRepository: PostSharesRepository,
    private postsSavesRepository: PostSavesRepository,
    private postLikesRepository: PostLikesRepository,
    private postsRepository: PostsRepository,
  ) {}

  public async getPosts(creatorId: string) {
    return await this.postsRepository.find({ where: { creatorId }, relations: { creatorProfile: true } });
  }

  public async getPost(creatorId: string, input: GetPostInput) {
    return await this.postsRepository.findOneOrFail({
      where: { creatorId, id: input.postId },
      relations: { creatorProfile: true },
    });
  }

  public async createPost(creatorId: string, input: CreatePostInput) {
    const post = await this.postsRepository.save({
      creatorId: creatorId,
      caption: input.caption,
      isExclusive: input.isExclusive,
      unlockPrice: input.unlockPrice,
    });
    await Promise.all(
      input.creatorAssetIds.map(async (assetId) => {
        await this.postAssetsRepository.save({ creatorAssetId: assetId, postId: post.id });
      }),
    );
    await this.creatorProfilesRepository.increment({ creatorId }, 'totalPost', 1);

    if (input.isExclusive) await this.creatorProfilesRepository.increment({ creatorId }, 'totalExclusivePost', 1);
    else await this.creatorProfilesRepository.increment({ creatorId }, 'totalPublicPost', 1);

    return post;
  }

  public async updatePost(creatorId: string, input: UpdatePostInput) {
    const { postId, ...rest } = input;
    const post = await this.postsRepository.findOneOrFail({
      where: { creatorId, id: postId },
      relations: { creatorProfile: true },
    });
    return this.postsRepository.save(Object.assign(post, shake(rest)));
  }

  public async deletePost(creatorId: string, input: DeletePostInput) {
    const post = await this.postsRepository.findOneOrFail({
      where: { id: input.postId, creatorId: creatorId },
      relations: { creatorProfile: true },
    });

    await this.creatorProfilesRepository.decrement({ creatorId }, 'totalPost', 1);

    if (post.isExclusive) await this.creatorProfilesRepository.decrement({ creatorId }, 'totalExclusivePost', 1);
    else await this.creatorProfilesRepository.decrement({ creatorId }, 'totalPublicPost', 1);

    const result = await this.postsRepository.delete(post);
    return !!result.affected;
  }

  public async createComment(fanId: string, input: CreateCommentInput) {
    const post = await this.postsRepository.findOneOrFail({ where: { id: input.postId } });
    const comment = this.postCommentsRepository.create({
      postId: input.postId,
      fanId: fanId,
      comment: input.comment,
    });
    post.postComments.push(comment);
    await this.postsRepository.increment({ id: input.postId }, 'commentCount', 1);
    return this.postsRepository.save(post);
  }

  public async updateComment(fanId: string, input: UpdateCommentInput) {
    const comment = await this.postCommentsRepository.findOneOrFail({
      where: { postId: input.postId, fanId: fanId },
    });

    return await this.postCommentsRepository.save(Object.assign(comment, shake(input)));
  }

  public async deleteComment(fanId: string, input: DeleteCommentInput) {
    const comment = await this.postCommentsRepository.findOneOrFail({
      where: { postId: input.postId, fanId: fanId },
    });
    const result = await this.postCommentsRepository.delete(comment);
    await this.postsRepository.decrement({ id: input.postId }, 'commentCount', 1);
    return !!result.affected;
  }

  public async likePost(fanId: string, input: LikePostInput) {
    await this.postsRepository.findOneOrFail({
      where: { id: input.postId },
      relations: { postLikes: true },
    });

    const isLiked = await this.postLikesRepository.findOne({ where: { postId: input.postId, fanId: fanId } });

    if (isLiked) {
      await this.postLikesRepository.delete({ postId: input.postId, fanId: fanId });
      await this.postsRepository.decrement({ id: input.postId }, 'likeCount', 1);
    } else {
      await this.postLikesRepository.save({ postId: input.postId, fanId: fanId });
      await this.postsRepository.increment({ id: input.postId }, 'likeCount', 1);
    }

    return await this.postsRepository.findOneOrFail({ where: { id: input.postId }, relations: { postLikes: true } });
  }

  public async sharePost(fanId: string, input: SharePostInput) {
    await this.postsRepository.findOneOrFail({ where: { id: input.postId } });

    const shared = this.postSharesRepository.create({ postId: input.postId, fanId: fanId });
    return await this.postSharesRepository.save(shared);
  }

  public async deleteShare(fanId: string, input: DeleteSharePostInput) {
    await this.postSharesRepository.findOneOrFail({
      where: { id: input.shareId, fanId: fanId, postId: input.postId },
    });

    const result = await this.postSharesRepository.delete({ id: input.shareId, postId: input.postId });
    return !!result.affected;
  }

  public async savePost(fanId: string, input: SavePostInput) {
    await this.postsRepository.findOneOrFail({ where: { id: input.postId } });
    const isSaved = await this.postsSavesRepository.findOne({ where: { postId: input.postId, fanId: fanId } });
    if (isSaved) {
      await this.postsSavesRepository.delete({ fanId: fanId, postId: input.postId });
      await this.postsRepository.decrement({ id: input.postId }, 'saveCount', 1);
    }
    await this.postsSavesRepository.save({ fanId: fanId, postId: input.postId });
    await this.postsRepository.increment({ id: input.postId }, 'saveCount', 1);

    return await this.postsRepository.findOneOrFail({ where: { id: input.postId } });
  }

  public async deletePosts(creatorId: string, input: DeletePostsInput) {
    const deleteResult = await Promise.all(
      input.postIds.map(async (postId) => {
        const message = await this.postsRepository.findOne({ where: { id: postId, creatorId: creatorId } });
        if (message) {
          await this.postsRepository.delete({ id: postId });
          await this.creatorProfilesRepository.decrement({ creatorId }, 'postCount', 1);
          return true;
        }
        return false;
      }),
    );
    return deleteResult.some((deleted) => deleted);
  }

  public async getPostsInfo(creatorId: string, input: GetPostsInfoInput) {
    return await this.postsRepository.getPostsInfo(creatorId, input);
  }
}
