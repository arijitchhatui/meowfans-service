import { UserProfilesRepository } from 'src/rdb/repositories';
import { PostsRepository } from 'src/rdb/repositories/posts.repository';

export class PostsService {
  public constructor(
    private userProfilesRepository: UserProfilesRepository,
    private postsRepository: PostsRepository,
  ) {}

  public async getPosts() {
    return this.postsRepository.find();
  }
}
