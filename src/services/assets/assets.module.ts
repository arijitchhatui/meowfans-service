import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsResolver } from './assets.resolver';
import { AssetsService } from './assets.service';

@Module({
  providers: [AssetsResolver, AssetsService],
  controllers: [AssetsController],
  exports: [AssetsService],
})
export class AssetsModule {}
