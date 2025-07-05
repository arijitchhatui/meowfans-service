import { Module } from '@nestjs/common';
import { UserProfilesResolver } from './user-profiles.resolver';
import { UserProfilesService } from './user-profiles.service';

@Module({
  providers: [UserProfilesResolver, UserProfilesService],
})
export class UserProfilesModule {}
