import { Injectable, Logger, Optional } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostCommentsEntity } from '../entities';
import { GetAllCommentsInput, GetPostCommentsInput } from '../../post-comments';

@Injectable()
export class PostCommentsRepository extends Repository<PostCommentsEntity> {
  private logger = new Logger(PostCommentsEntity.name);

  constructor(@Optional() _target: EntityTarget<PostCommentsEntity>, entityManager: EntityManager) {
    super(PostCommentsEntity, entityManager);
  }

  public async getAllComments(creatorId: string, input: GetAllCommentsInput) {
    return await this.createQueryBuilder('post_comments')
      .leftJoin('post_comments.fanProfile', 'fanProfile')
      .leftJoin('fanProfile.user', 'user')
      .innerJoin('post_comments.post', 'post')
      .addSelect(['user.avatarUrl', 'user.fullName', 'user.username', 'fanProfile.fanId'])
      .where('post.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('post_comments.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset)
      .getMany();
  }

  public async getCommentsByPostId(creatorId: string, input: GetPostCommentsInput) {
    return await this.createQueryBuilder('post_comments')
      .leftJoin('post_comments.fanProfile', 'fanProfile')
      .leftJoin('fanProfile.user', 'user')
      .innerJoin('post_comments.post', 'post')
      .addSelect(['user.avatarUrl', 'user.username', 'user.fullName', 'fanProfile.fanId'])
      .where('post_comments.postId = :postId', { postId: input.postId })
      .andWhere('post.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('post_comments.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset)
      .getMany();
  }
}
