import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../postgres/repositories';

@Injectable()
export class UsersService {
  public constructor(private usersRepository: UsersRepository) {}

  public async deleteUser(userId: string) {
    const result = await this.usersRepository.deleteUser(userId);
    return result;
  }
}
