import { Module } from '@nestjs/common';
import { FanProfilesResolver } from './fan-profiles.resolver';
import { FanProfilesService } from './fan-profiles.service';

@Module({
  providers: [FanProfilesResolver, FanProfilesService],
  exports: [FanProfilesService],
})
export class FanProfilesModule {}
