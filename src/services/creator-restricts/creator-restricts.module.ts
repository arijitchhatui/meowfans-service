import { Module } from '@nestjs/common';
import { CreatorRestrictsResolver } from './creator-restricts.resolver';
import { CreatorRestrictsService } from './creator-restricts.service';

@Module({
  providers: [CreatorRestrictsService, CreatorRestrictsResolver],
  exports: [CreatorRestrictsService],
})
export class CreatorRestrictsModule {}
