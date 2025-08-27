import { Module } from '@nestjs/common';
import { AwsS3Module } from '../aws';
import { AssetsController } from './assets.controller';
import { AssetsResolver } from './assets.resolver';
import { AssetsService } from './assets.service';

@Module({
  providers: [AssetsResolver, AssetsService],
  controllers: [AssetsController],
  exports: [AssetsService],
  imports: [AwsS3Module],
})
export class AssetsModule {}
