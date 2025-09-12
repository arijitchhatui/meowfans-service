import { Module } from '@nestjs/common';
import { FanProfilesResolver } from './fan-profiles.resolver';
import { FanProfilesService } from './fan-profiles.service';
import { UniqueUsernameValidator } from '../auth';
import { ProfanityValidator } from '@app/validators';

@Module({
  providers: [FanProfilesResolver, FanProfilesService, UniqueUsernameValidator, ProfanityValidator],
  exports: [FanProfilesService],
})
export class FanProfilesModule {}
