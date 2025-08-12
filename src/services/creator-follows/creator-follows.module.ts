import { Module } from '@nestjs/common';
import { CreatorFollowsResolver } from './creator-follows.resolver';
import { CreatorFollowsService } from './creator-follows.service';

@Module({
  providers: [CreatorFollowsService, CreatorFollowsResolver],
})
export class CreatorFollowsModule {}
