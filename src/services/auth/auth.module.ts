import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Request } from 'express';
import { UniqueEmailValidator, UniqueUsernameValidator } from '../../lib';
import { CryptoService } from '../../lib/methods/encode.method';
import { AwsS3Module } from '../aws';
import { ProviderTokens } from '../service.constants';
import { SessionsService } from '../sessions/sessions.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { REQUEST } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    AwsS3Module,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UniqueEmailValidator,
    UniqueUsernameValidator,
    CryptoService,
    SessionsService,
    {
      provide: ProviderTokens.REQUEST_USER_TOKEN,
      inject: [REQUEST],
      useFactory: (req: Request) => req,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
