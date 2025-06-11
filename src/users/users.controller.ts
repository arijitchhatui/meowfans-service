import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserInput } from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller({ path: '/users' })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:username')
  async getUserProfile(@Param(':username') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Patch('/edit')
  async updateUserProfile(@Param(':userId') userId: string, @Body() input: UpdateUserInput) {
    return this.updateUserProfile(userId, input);
  }
}
