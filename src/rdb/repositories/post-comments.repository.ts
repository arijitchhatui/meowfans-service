import { Injectable, Logger, Optional } from '@nestjs/common';
import { GetPostCommentsInput } from 'src/post-comments/dto/get-post-comments.dto';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { PostCommentsEntity } from '../entities';
import { GetAllCommentsInput } from 'src/post-comments';

@Injectable()
export class PostCommentsRepository extends Repository<PostCommentsEntity> {
  private logger = new Logger(PostCommentsEntity.name);

  constructor(@Optional() _target: EntityTarget<PostCommentsEntity>, entityManager: EntityManager) {
    super(PostCommentsEntity, entityManager);
  }

  public async getAllComments(creatorId: string, input: GetAllCommentsInput) {
    const query = this.createQueryBuilder('post_comments')
      .leftJoinAndSelect('post_comments.userProfile', 'userProfile')
      .innerJoin('post_comments.post', 'post')
      .addSelect(['userProfile.avatarUrl', 'userProfile.fullName', 'userProfile.username'])
      .where('post.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('post_comments.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset);

    return await query.getMany();
  }

  public async getCommentsByPostId(creatorId: string, input: GetPostCommentsInput) {
    const query = this.createQueryBuilder('post_comments')
      .leftJoin('post_comments.userProfile', 'userProfile')
      .innerJoin('post_comments.post', 'post')
      .addSelect(['userProfile.avatarUrl', 'userProfile.username', 'userProfile.fullName'])
      .where('post_comments.postId = :postId', { postId: input.postId })
      .andWhere('post.creatorId = :creatorId', { creatorId: creatorId })
      .orderBy('post_comments.createdAt', 'DESC')
      .limit(30)
      .offset(input.offset);

    return await query.getMany();
  }
}
