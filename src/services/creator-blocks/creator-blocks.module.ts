import { Module } from '@nestjs/common';
import { CreatorBlocksResolver } from './creator-blocks.resolver';
import { CreatorBlocksService } from './creator-blocks.service';

@Module({
  providers: [CreatorBlocksService, CreatorBlocksResolver],
})
export class CreatorBlocksModule {}
