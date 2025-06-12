import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  controllers: [],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
