import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth, CurrentUserExpanded, JwtUser } from './decorators';
import { LoginInput, SignupInput } from './dto';
import { CreatorSignupInput } from './dto/creator-signup.dto';
import { JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller({ path: '/auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginInput) {
    return this.authService.login(body);
  }

  @Post('/signup')
  async signup(@Body() body: SignupInput) {
    return this.authService.signup(body);
  }

  @Post('/onboarding')
  async creatorSignup(@Body() body: CreatorSignupInput) {
    return this.authService.creatorSignup(body);
  }

  @Auth(JwtAuthGuard, [])
  @ApiBearerAuth()
  @Get('/status')
  async getStatus(@CurrentUserExpanded() user: JwtUser) {
    return this.authService.getCurrentFan(user);
  }
}
