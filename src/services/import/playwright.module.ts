import { Global, Logger, Module } from '@nestjs/common';

@Global()
@Module({})
export class PlaywrightModule {
  private logger = new Logger(PlaywrightModule.name);
  onModuleInit() {
    this.logger.log('PlaywrightModule initialized');
  }
}
