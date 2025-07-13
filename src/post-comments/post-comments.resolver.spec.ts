import { Test, TestingModule } from '@nestjs/testing';
import { PostCommentsResolver } from './post-comments.resolver';

describe('PostCommentsResolver', () => {
  let resolver: PostCommentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostCommentsResolver],
    }).compile();

    resolver = module.get<PostCommentsResolver>(PostCommentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
