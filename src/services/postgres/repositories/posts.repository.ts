import { PostTypes } from '@app/enums';
import { PaginationInput } from '@app/helpers';
import { EntityMaker } from '@app/methods';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { GetPostsInfoOutput } from '../../posts';
import { PostCommentsEntity, PremiumPostUnlocksEntity } from '../entities';
import { PostsEntity } from '../entities/posts.entity';

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

  public async getPosts(creatorId: string, input: PaginationInput): Promise<PostsEntity[]> {
    const { limit, offset, postTypes, orderBy } = input;

    return await this.createQueryBuilder('posts')
      .where('posts.creatorId = :creatorId', { creatorId: creatorId })
      .leftJoinAndSelect('posts.postAssets', 'postAssets')
      .leftJoinAndSelect('postAssets.asset', 'asset')
      .limit(limit)
      .offset(offset)
      .andWhere('posts.types && :postTypes', { postTypes: await this.insertPostType(postTypes) })
      .orderBy('posts.createdAt', orderBy)
      .getMany();
  }

  private async insertPostType(postTypes?: PostTypes[] | null): Promise<PostTypes[]> {
    return !postTypes || !postTypes.length ? Object.values(PostTypes) : postTypes;
  }
}
