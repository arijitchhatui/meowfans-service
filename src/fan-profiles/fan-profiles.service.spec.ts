import { Test, TestingModule } from '@nestjs/testing';
import { FanProfilesService } from './fan-profiles.service';

describe('FanProfilesService', () => {
  let service: FanProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FanProfilesService],
    }).compile();

    service = module.get<FanProfilesService>(FanProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
