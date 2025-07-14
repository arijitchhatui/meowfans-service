import { Test, TestingModule } from '@nestjs/testing';
import { FanProfilesResolver } from './fan-profiles.resolver';

describe('FanProfilesResolver', () => {
  let resolver: FanProfilesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FanProfilesResolver],
    }).compile();

    resolver = module.get<FanProfilesResolver>(FanProfilesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
