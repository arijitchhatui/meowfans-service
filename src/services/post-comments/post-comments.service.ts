import { Injectable } from '@nestjs/common';
import { PostCommentsRepository } from '../rdb/repositories';
import { PaginationInput } from '../../lib/helpers';

@Injectable()
export class PostCommentsService {
  public constructor(private postCommentsRepository: PostCommentsRepository) {}

  public async getPostCommentsByPostId(creatorId: string, input: PaginationInput) {
    return await this.postCommentsRepository.getCommentsByPostId(creatorId, input);
  }

  public async getAllComments(creatorId: string, input: PaginationInput) {
    return await this.postCommentsRepository.getAllComments(creatorId, input);
  }
}
