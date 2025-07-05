import { Test, TestingModule } from '@nestjs/testing';
import { UserProfilesResolver } from './user-profiles.resolver';

describe('UserProfilesResolver', () => {
  let resolver: UserProfilesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProfilesResolver],
    }).compile();

    resolver = module.get<UserProfilesResolver>(UserProfilesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
