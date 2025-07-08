import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { CreatorProfilesRepository, PostsRepository } from 'src/rdb/repositories';
import { DeletePostInput, GetPostInput, UpdatePostInput } from './dto';
import { CreatePostInput } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  public constructor(
    private creatorProfilesRepository: CreatorProfilesRepository,
    private postsRepository: PostsRepository,
  ) {}

  public async getPosts(creatorId: string) {
    return await this.postsRepository.find({ where: { creatorId }, relations: { creatorProfile: true } });
  }

  public async getPost(creatorId: string, input: GetPostInput) {
    return await this.postsRepository.findOneOrFail({
      where: { creatorId, id: input.postId },
      relations: { creatorProfile: true },
    });
  }

  public async createPost(creatorId: string, input: CreatePostInput) {
    const post = this.postsRepository.create({
      creatorId: creatorId,
      caption: input.caption,
      isExclusive: input.isExclusive,
      price: input.price,
    });
    return await this.postsRepository.save(post);
  }

  public async updatePost(creatorId: string, input: UpdatePostInput) {
    const { postId, ...rest } = input;
    const post = await this.postsRepository.findOneOrFail({
      where: { creatorId, id: postId },
      relations: { creatorProfile: true },
    });
    return this.postsRepository.save(Object.assign(post, shake(rest)));
  }

  public async deletePost(creatorId: string, input: DeletePostInput) {
    const post = await this.postsRepository.findOneOrFail({
      where: { id: input.postId },
      relations: { creatorProfile: true },
    });
    if (!post)
      return await this.postsRepository.find({
        where: { creatorId },
        relations: { creatorProfile: true },
      });

    await this.postsRepository.remove(post);
    return await this.postsRepository.find({
      where: { creatorId },
      relations: { creatorProfile: true },
    });
  }
}
