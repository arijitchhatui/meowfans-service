import { CryptoService } from '@app/methods';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AwsS3Module } from '../aws';
import { SessionsService } from '../sessions/sessions.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UniqueEmailValidator, UniqueUsernameValidator } from './validators';

@Global()
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
  providers: [JwtStrategy, AuthService, UniqueEmailValidator, UniqueUsernameValidator, CryptoService, SessionsService],
  exports: [AuthService],
})
export class AuthModule {}
