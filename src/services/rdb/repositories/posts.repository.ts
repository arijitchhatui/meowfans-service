import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PaginationInput } from '../../../lib/helpers';
import { EntityMaker } from '../../../lib/methods';
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
      .limit(input.limit)
      .offset(input.offset)
      .getRawMany<GetPostsInfoOutput>();

    return await EntityMaker.fromRawToEntityType<GetPostsInfoOutput>({
      rawQueryMap: query,
      mappers: [{ aliasName: 'posts' }],
    });
  }

  public async getPosts(creatorId: string, input: PaginationInput): Promise<PostsEntity[]> {
    return await this.createQueryBuilder('posts')
      .where('posts.creatorId = :creatorId', { creatorId: creatorId })
      .limit(input.limit)
      .offset(input.offset)
      .andWhere(':postTypes = ANY (posts.types)', { postTypes: input.postTypes })
      .orderBy('posts.createdAt', input.orderBy)
      .getMany();
  }
}
