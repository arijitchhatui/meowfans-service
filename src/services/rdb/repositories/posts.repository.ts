import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { EntityMaker } from '../../../lib/methods';
import { GetPostsInfoInput, GetPostsInfoOutput } from '../../posts';
import { PostCommentsEntity, PremiumPostUnlocksEntity } from '../entities';
import { PostsEntity } from '../entities/posts.entity';

@Injectable()
export class PostsRepository extends Repository<PostsEntity> {
  private logger = new Logger(PostsRepository.name);

  constructor(
    @Optional() _target: EntityTarget<PostsEntity>,
    entityManager: EntityManager,
    private entityBuilder: EntityMaker,
  ) {
    super(PostsEntity, entityManager);
  }
  public async getPostsInfo(creatorId: string, input: GetPostsInfoInput) {
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
      .limit(30)
      .offset(input.offset)
      .getRawMany<GetPostsInfoOutput>();

    return await this.entityBuilder.fromRawToEntityType<GetPostsInfoOutput>({
      rawQueryMap: query,
      mappers: [{ aliasName: 'posts' }],
    });
  }
}
