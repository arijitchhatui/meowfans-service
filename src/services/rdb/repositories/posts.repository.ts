import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { EntityMaker } from '../../../lib/methods';
import { GetPostsInfoOutput } from '../../posts';
import { GetPostsOutput } from '../../posts/dto/get-posts.out.dto';
import { PostTypes } from '../../service.constants';
import { AssetsEntity, PostCommentsEntity, PremiumPostUnlocksEntity } from '../entities';
import { PostsEntity } from '../entities/posts.entity';

type GetPostsOutputType = {
  id: string;
  caption: string;
  creatorId: string;
  unlockPrice: number | null;
  likeCount: number;
  saveCount: number;
  shareCount: number;
  commentCount: number;
  totalEarning: number;
  types: PostTypes[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  lastCommentId: string;
  assets: AssetsEntity;
};

@Injectable()
export class PostsRepository extends Repository<PostsEntity> {
  private logger = new Logger(PostsRepository.name);

  constructor(@Optional() _target: EntityTarget<PostsEntity>, entityManager: EntityManager) {
    super(PostsEntity, entityManager);
  }

  public async getPostsInfo(creatorId: string, input: PaginationInput) {
    const { postTypes, limit, offset } = input;

    const commentSubQuery = this.createQueryBuilder()
      .select('DISTINCT ON (c."post_id") c."post_id"', 'postId')
      .addSelect('c."id"', 'commentId')
      .addSelect('c."comment"', 'latestComment')
      .from(PostCommentsEntity, 'c')
      .orderBy('c."post_id"')
      .addOrderBy('c."created_at"', 'DESC');

    const earningSubQuery = this.createQueryBuilder()
      .select('COALESCE(SUM(u.amount), 0)')
      .from(PremiumPostUnlocksEntity, 'u')
      .where('u."post_id" = posts.id');

    const query = this.createQueryBuilder('posts')
      .leftJoin(`(${commentSubQuery.getQuery()})`, 'latestComment', '"latestComment"."postId" = posts.id')
      .setParameters(commentSubQuery.getParameters())
      .addSelect('"latestComment"."latestComment"', 'latestComment')
      .addSelect('posts.*')
      .addSelect(`(${earningSubQuery.getQuery()})`, 'totalEarning')
      .where('posts.creatorId = :creatorId', { creatorId })
      .andWhere('posts.types && :postTypes', { postTypes: await this.insertPostType(postTypes) })
      .orderBy('posts.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany<GetPostsInfoOutput>();

    return await EntityMaker.fromRawToEntityType<GetPostsInfoOutput>({
      rawQueryMap: query,
      mappers: [{ aliasName: 'posts' }],
    });
  }

  public async getPosts(creatorId: string, input: PaginationInput): Promise<GetPostsOutput[]> {
    const { limit, offset, postTypes, orderBy } = input;

    const query = this.createQueryBuilder('posts')
      .where('posts.creatorId = :creatorId', { creatorId: creatorId })
      .leftJoin('posts.postAssets', 'postAssets')
      .leftJoin('postAssets.creatorAsset', 'creatorAsset')
      .leftJoinAndMapMany('creatorAsset.asset', AssetsEntity, 'assets', 'assets.id = creatorAsset.assetId')
      .limit(limit)
      .offset(offset)
      .andWhere('posts.types && :postTypes', { postTypes: await this.insertPostType(postTypes) })
      .orderBy('posts.createdAt', orderBy)
      .getRawMany<GetPostsOutput>();

    const rawPosts = await EntityMaker.fromRawToEntityType<GetPostsOutputType>({
      rawQueryMap: query,
      mappers: [{ aliasName: 'assets', entityFieldOutputName: 'assets' }, { aliasName: 'posts' }],
    });

    const postsMap: Record<string, GetPostsOutput> = {};
    for (const rawPost of rawPosts) {
      postsMap[rawPost.id] ??= { ...rawPost, assets: [] };
      postsMap[rawPost.id].assets.push(rawPost.assets);
    }
    return Object.values(postsMap);
  }

  private async insertPostType(postTypes?: PostTypes[] | null): Promise<PostTypes[]> {
    return !postTypes || !postTypes.length ? Object.values(PostTypes) : postTypes;
  }
}
