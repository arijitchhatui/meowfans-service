import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { EntityMaker } from '../../../lib/methods';
import { GetPostsInfoOutput } from '../../posts';
import { PostTypes } from '../../service.constants';
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
      .select('SUM(u.amount)')
      .from(PremiumPostUnlocksEntity, 'u')
      .where('u."post_id" = posts.id');

    const query = this.createQueryBuilder('posts')
      .leftJoin(`(${commentSubQuery.getQuery()})`, 'latestComment', '"latestComment"."postId" = posts.id')
      .setParameters(commentSubQuery.getParameters())
      .addSelect('"latestComment"."latestComment"', 'latestComment')
      .addSelect('posts.*')
      .addSelect(`(${earningSubQuery.getQuery()})`, 'totalEarning')
      .where('posts.creatorId = :creatorId', { creatorId })
      .orderBy('posts.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    query.andWhere('posts.types && :postTypes', { postTypes: await this.insertPostType(postTypes) });

    return await EntityMaker.fromRawToEntityType<GetPostsInfoOutput>({
      rawQueryMap: query.getRawMany<GetPostsInfoOutput>(),
      mappers: [{ aliasName: 'posts' }],
    });
  }

  public async getPosts(creatorId: string, input: PaginationInput): Promise<PostsEntity[]> {
    const { limit, offset, postTypes, orderBy } = input;

    return await this.createQueryBuilder('posts')
      .where('posts.creatorId = :creatorId', { creatorId: creatorId })
      .limit(limit)
      .offset(offset)
      .andWhere('posts.types && :postTypes', { postTypes: this.insertPostType(postTypes) })
      .orderBy('posts.createdAt', orderBy)
      .getMany();
  }

  private async insertPostType(postTypes?: PostTypes[] | null): Promise<PostTypes[]> {
    const postTypesToArray = Object.values(PostTypes);

    if (!postTypes || !postTypes.length) return postTypesToArray;
    return postTypes;
  }
}
