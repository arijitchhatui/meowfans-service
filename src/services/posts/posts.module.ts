import { Module } from '@nestjs/common';
import { HasAssetsForExclusivePropValidator, ProfanityValidator } from '../../lib';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsResolver, PostsService, HasAssetsForExclusivePropValidator, ProfanityValidator],
  exports: [PostsService],
})
export class PostsModule {}
