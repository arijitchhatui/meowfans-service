import { Module } from '@nestjs/common';
import { VaultsResolver } from './vaults.resolver';
import { VaultsService } from './vaults.service';

@Module({
  providers: [VaultsService, VaultsResolver],
  exports: [VaultsService],
})
export class VaultsModule {}
