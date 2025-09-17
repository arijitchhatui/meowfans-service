import { ProviderTokens } from '@app/enums';
import { Global, Inject, Module } from '@nestjs/common';
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
  exports: [ProviderTokens.REDIS_TOKEN],
})
export class RedisModule {
  constructor(@Inject(ProviderTokens.REDIS_TOKEN) private redis: Redis) {}
  onModuleInit() {
    this.redis.ping();
  }
}
