import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ProviderTokens } from '../../util/enums';
import { SSEController } from './sse.controller';
import { SSEService } from './sse.service';

@Module({
  providers: [
    SSEService,
    {
      provide: ProviderTokens.REDIS_PUB_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        return new Redis(configService.getOrThrow<string>('REDIS_URL'));
      },
    },
    {
      provide: ProviderTokens.REDIS_SUB_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        return new Redis(configService.getOrThrow<string>('REDIS_URL'));
      },
    },
  ],
  imports: [],
  controllers: [SSEController],
  exports: [SSEService, ProviderTokens.REDIS_PUB_TOKEN, ProviderTokens.REDIS_SUB_TOKEN],
})
export class SSEModule {}
