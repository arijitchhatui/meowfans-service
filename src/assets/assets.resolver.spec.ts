import { Test, TestingModule } from '@nestjs/testing';
import { AssetsResolver } from './assets.resolver';

describe('AssetsResolver', () => {
  let resolver: AssetsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsResolver],
    }).compile();

    resolver = module.get<AssetsResolver>(AssetsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
