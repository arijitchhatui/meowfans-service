import { ProviderTokens } from '@app/enums';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: ProviderTokens.REDIS_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        return new Redis(configService.getOrThrow<string>('REDIS_URL'));
      },
    },
  ],
})
export class RedisModule {}
