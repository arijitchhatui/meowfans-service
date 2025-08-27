import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UniqueEmailValidator, UniqueUsernameValidator } from '../../lib';
import { AwsS3Module } from '../aws';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    AwsS3Module,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UniqueEmailValidator, UniqueUsernameValidator],
  exports: [AuthService],
})
export class AuthModule {}
