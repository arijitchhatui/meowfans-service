import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ServicesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
