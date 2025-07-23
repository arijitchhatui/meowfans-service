import { Injectable } from '@nestjs/common';
import { PostCommentsRepository } from '../rdb/repositories';
import { GetAllCommentsInput } from './dto/get-all-comments.dto';
import { GetPostCommentsInput } from './dto/get-post-comments.dto';

@Injectable()
export class PostCommentsService {
  public constructor(private postCommentsRepository: PostCommentsRepository) {}

  public async getPostCommentsByPostId(creatorId: string, input: GetPostCommentsInput) {
    return await this.postCommentsRepository.getCommentsByPostId(creatorId, input);
  }

  public async getAllComments(creatorId: string, input: GetAllCommentsInput) {
    return await this.postCommentsRepository.getAllComments(creatorId, input);
  }
}
