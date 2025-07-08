import { Global, Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';

@Global()
@Module({
  imports: [],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
