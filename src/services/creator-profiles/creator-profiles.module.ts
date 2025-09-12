import { Module } from '@nestjs/common';
import { CreatorProfilesResolver } from './creator-profiles.resolver';
import { CreatorProfilesService } from './creator-profiles.service';
import { UniqueUsernameValidator } from '../auth';
import { ProfanityValidator } from '@app/validators';

@Module({
  providers: [CreatorProfilesResolver, CreatorProfilesService, UniqueUsernameValidator, ProfanityValidator],
  exports: [CreatorProfilesService],
})
export class CreatorProfilesModule {}
