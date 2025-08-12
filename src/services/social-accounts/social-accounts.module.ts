import { Module } from '@nestjs/common';
import { SocialAccountsResolver } from './social-accounts.resolver';

@Module({
  providers: [SocialAccountsResolver],
})
export class SocialAccountsModule {}
