import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersEntity } from '../postgres/entities';
import { UserRoles } from '../service.constants';
import { AuthService } from './auth.service';
import { Auth, CurrentUserExpanded, JwtUser } from './decorators';
import { AuthOk, FanSignupInput, LoginInput } from './dto';
import { CreatorSignupInput } from './dto/creator-signup.dto';
import { JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller({ path: '/auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  public async login(@Body() body: LoginInput): Promise<AuthOk> {
    const { sub: userId } = await this.authService.validateUser(body);
    return await this.authService.login(userId);
  }

  @Post('/fan-signup')
  public async fanSignup(@Body() body: FanSignupInput): Promise<AuthOk> {
    return await this.authService.fanSignup(body);
  }

  @Post('/creator-signup')
  public async creatorSignup(@Body() body: CreatorSignupInput): Promise<AuthOk> {
    return await this.authService.creatorSignup(body);
  }

  @Auth(JwtAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @ApiBearerAuth()
  @Get('/status')
  public async getStatus(@CurrentUserExpanded() user: JwtUser): Promise<UsersEntity> {
    return await this.authService.getStatus(user);
  }

  @Auth(JwtAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @ApiBearerAuth()
  @Get('/validate-username')
  public async scanOrCreateUsername(@Query('username') username: string): Promise<string> {
    return await this.authService.scanOrCreateUsername(username);
  }
}
