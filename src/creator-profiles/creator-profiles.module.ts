import { Module } from '@nestjs/common';
import { CreatorProfilesResolver } from './creator-profiles.resolver';
import { CreatorProfilesService } from './creator-profiles.service';

@Module({
  providers: [CreatorProfilesResolver, CreatorProfilesService],
})
export class CreatorProfilesModule {}
