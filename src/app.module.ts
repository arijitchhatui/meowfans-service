import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ServicesModule } from './services/services.module';
import { CreatorFollowsModule } from './services/creator-follows/creator-follows.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ServicesModule, CreatorFollowsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
