import { Module } from '@nestjs/common';
import { UploadsModule } from '../uploads';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
  imports: [UploadsModule],
})
export class UsersModule {}
