import { Module } from '@nestjs/common';
import { SSEService } from '../sse/sse.service';
import { VaultsResolver } from './vaults.resolver';
import { VaultsService } from './vaults.service';

@Module({
  imports: [],
  providers: [VaultsService, VaultsResolver, SSEService],
  exports: [VaultsService],
})
export class VaultsModule {}
