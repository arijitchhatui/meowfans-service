import { Module } from '@nestjs/common';
import { ProfanityValidator, UniqueUsernameValidator } from '../../lib';
import { CreatorProfilesResolver } from './creator-profiles.resolver';
import { CreatorProfilesService } from './creator-profiles.service';

@Module({
  providers: [CreatorProfilesResolver, CreatorProfilesService, UniqueUsernameValidator, ProfanityValidator],
  exports: [CreatorProfilesService],
})
export class CreatorProfilesModule {}
