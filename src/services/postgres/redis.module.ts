import { Global, Inject, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ProviderTokens } from '../../util/enums';

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
  exports: [ProviderTokens.REDIS_TOKEN, ProviderTokens.REDIS_PUB_TOKEN, ProviderTokens.REDIS_SUB_TOKEN],
})
export class RedisModule {
  private logger = new Logger(RedisModule.name);
  constructor(@Inject(ProviderTokens.REDIS_TOKEN) private redis: Redis) {}
  async onModuleInit() {
    const res = await this.redis.ping();
    this.logger.log(res);
  }
}
