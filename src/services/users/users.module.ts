import { Module } from '@nestjs/common';
import { AwsS3Module } from '../aws';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
  imports: [AwsS3Module],
})
export class UsersModule {}
