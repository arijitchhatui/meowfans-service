import { Test, TestingModule } from '@nestjs/testing';
import { CreatorProfilesService } from './creator-profiles.service';

describe('CreatorProfilesService', () => {
  let service: CreatorProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorProfilesService],
    }).compile();

    service = module.get<CreatorProfilesService>(CreatorProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
