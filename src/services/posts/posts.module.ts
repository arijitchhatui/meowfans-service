import { HasAssetsForExclusivePropValidator, ProfanityValidator } from '@app/validators';
import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsResolver, PostsService, HasAssetsForExclusivePropValidator, ProfanityValidator],
  exports: [PostsService],
})
export class PostsModule {}
