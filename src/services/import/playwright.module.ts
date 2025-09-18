import { Global, Logger, Module } from '@nestjs/common';
import { Browser, chromium } from '@playwright/test';
import { ProviderTokens } from '../../util/enums';

@Global()
@Module({
  providers: [
    {
      provide: ProviderTokens.PLAYWRIGHT_TOKEN,
      useFactory: async (): Promise<Browser> => {
        return await chromium.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      },
    },
  ],
  exports: [ProviderTokens.PLAYWRIGHT_TOKEN],
})
export class PlaywrightModule {
  private logger = new Logger(PlaywrightModule.name);
  onModuleInit() {
    this.logger.log('PlaywrightModule initialized');
  }
}
