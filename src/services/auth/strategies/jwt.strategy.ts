import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuardStrategyMapping, JWT_VERSION } from '../constants';
import { JwtUser } from '../decorators';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthGuardStrategyMapping.JWT) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
  async validate(payload: JwtUser): Promise<JwtUser> {
    if (payload.version !== JWT_VERSION) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
