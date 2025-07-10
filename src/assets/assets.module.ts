import { Module } from '@nestjs/common';
import { AssetsResolver } from './assets.resolver';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';

@Module({
  providers: [AssetsResolver, AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
