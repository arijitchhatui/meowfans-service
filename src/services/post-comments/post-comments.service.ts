import { Injectable } from '@nestjs/common';
import { PaginationInput } from '../../lib/helpers';
import { PostCommentsRepository } from '../postgres/repositories';

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
