import { Module } from '@nestjs/common';
import { HasAssetsForExclusivePropValidator } from '../../lib';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsResolver, PostsService, HasAssetsForExclusivePropValidator],
  exports: [PostsService],
})
export class PostsModule {}
