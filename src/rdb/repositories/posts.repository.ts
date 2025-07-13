import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetPostsInfoInput, GetPostsInfoOutput } from 'src/posts';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostCommentsEntity } from '../entities';
import { PostsEntity } from '../entities/posts.entity';

@Injectable()
export class PostsRepository extends Repository<PostsEntity> {
  private logger = new Logger(PostsRepository.name);

  constructor(@Optional() _target: EntityTarget<PostsEntity>, entityManager: EntityManager) {
    super(PostsEntity, entityManager);
  }

  public async getPostsInfo(creatorId: string, input: GetPostsInfoInput) {
    const commentSubQuery = this.createQueryBuilder('post_comments')
      .select('post_comments.id')
      .where('post_comments.postId = posts.id')
      .orderBy('post_comments.createdAt', 'DESC')
      .limit(1);

    const earningSubQuery = this.createQueryBuilder('post_unlocks')
      .select('SUM(post_unlocks.amount)')
      .from('premium_post_unlocks', 'postUnlocks')
      .where('postUnlocks.postId = posts.id');

    const query = this.createQueryBuilder('posts')
      .leftJoinAndMapOne(
        'posts.latestComment',
        PostCommentsEntity,
        'latestComment',
        `latestComment.id = ${commentSubQuery.getQuery()}`,
      )
      .setParameters(commentSubQuery.getParameters())
      .addSelect(`${earningSubQuery.getQuery()}`, 'totalEarning')
      .where('posts.creatorId = :creatorId', { creatorId })
      .orderBy('posts.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset);

    return await query.getRawMany<GetPostsInfoOutput>();
  }
}
