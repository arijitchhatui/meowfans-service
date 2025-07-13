import { Module } from '@nestjs/common';
import { PostCommentsResolver } from './post-comments.resolver';
import { PostCommentsService } from './post-comments.service';

@Module({
  providers: [PostCommentsResolver, PostCommentsService],
})
export class PostCommentsModule {}
