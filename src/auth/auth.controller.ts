import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, CurrentUserExpanded, JwtUser } from './decorators';
import { LoginInput, SignupInput } from './dto';
import { JwtAuthGuard } from './guards';

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

  @Auth(JwtAuthGuard, [])
  @Get('/status')
  async getStatus(@CurrentUserExpanded() user: JwtUser) {
    return this.authService.getCurrentUser(user);
  }
}
