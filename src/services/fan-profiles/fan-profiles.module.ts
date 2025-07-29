import { Module } from '@nestjs/common';
import { ProfanityValidator, UniqueUsernameValidator } from '../../lib';
import { FanProfilesResolver } from './fan-profiles.resolver';
import { FanProfilesService } from './fan-profiles.service';

@Module({
  providers: [FanProfilesResolver, FanProfilesService, UniqueUsernameValidator, ProfanityValidator],
  exports: [FanProfilesService],
})
export class FanProfilesModule {}
