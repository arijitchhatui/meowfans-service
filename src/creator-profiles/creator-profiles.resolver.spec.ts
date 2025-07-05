import { Test, TestingModule } from '@nestjs/testing';
import { CreatorProfilesResolver } from './creator-profiles.resolver';

describe('CreatorProfilesResolver', () => {
  let resolver: CreatorProfilesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorProfilesResolver],
    }).compile();

    resolver = module.get<CreatorProfilesResolver>(CreatorProfilesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
