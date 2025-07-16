import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetAllCommentsInput } from 'src/post-comments';
import { GetPostCommentsInput } from 'src/post-comments/dto/get-post-comments.dto';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostCommentsEntity } from '../entities';

@Injectable()
export class PostCommentsRepository extends Repository<PostCommentsEntity> {
  private logger = new Logger(PostCommentsEntity.name);

  constructor(@Optional() _target: EntityTarget<PostCommentsEntity>, entityManager: EntityManager) {
    super(PostCommentsEntity, entityManager);
  }

  public async getAllComments(creatorId: string, input: GetAllCommentsInput) {
    return await this.createQueryBuilder('post_comments')
      .leftJoin('post_comments.fanProfile', 'fanProfile')
      .innerJoin('post_comments.post', 'post')
      .addSelect(['fanProfile.avatarUrl', 'fanProfile.fullName', 'fanProfile.username', 'fanProfile.fanId'])
      .where('post.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('post_comments.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset)
      .getMany();
  }

  public async getCommentsByPostId(creatorId: string, input: GetPostCommentsInput) {
    return await this.createQueryBuilder('post_comments')
      .leftJoin('post_comments.fanProfile', 'fanProfile')
      .innerJoin('post_comments.post', 'post')
      .addSelect(['fanProfile.avatarUrl', 'fanProfile.username', 'fanProfile.fullName', 'fanProfile.fanId'])
      .where('post_comments.postId = :postId', { postId: input.postId })
      .andWhere('post.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('post_comments.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset)
      .getMany();
  }
}
