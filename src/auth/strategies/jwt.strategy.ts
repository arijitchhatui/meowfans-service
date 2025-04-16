import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthGuardStrategyMapping } from '../constants';
import { JwtUser } from '../decorators';

@Injectable()
export class JwtStrategy extends AuthGuard(AuthGuardStrategyMapping.JWT) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
  async validate(payload: JwtUser): Promise<JwtUser> {
    return this.authService.validateJwt(payload);
  }
}
