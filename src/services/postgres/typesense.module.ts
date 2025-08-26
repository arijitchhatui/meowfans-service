import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'typesense';
import { ProviderTokens } from '../service.constants';

export type TypeSenseClient = Client;

@Global()
@Module({
  providers: [
    {
      provide: ProviderTokens.TYPE_SENSE_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeSenseClient => {
        const client = new Client({
          nodes: [
            {
              host: configService.getOrThrow('TYPSENSE_HOST'),
              port: configService.getOrThrow('TYPESENSE_PORT'),
              protocol: configService.getOrThrow('TYPSENSE_PROTOCOL'),
            },
          ],
          apiKey: configService.getOrThrow<string>('TYPESENSE_API_KEY'),
          connectionTimeoutSeconds: 2,
          randomizeNodes: true,
        });
        return client;
      },
    },
  ],
})
export class TypeSenseModule {}
