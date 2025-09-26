import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { MeowFansMiddleware } from '../libs/middleware/middleware';
import { AppController } from './app.controller';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ServicesModule, SentryModule.forRoot()],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MeowFansMiddleware).forRoutes('*');
  }
}
