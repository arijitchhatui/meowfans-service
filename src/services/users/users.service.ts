import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../postgres/entities';
import { UsersRepository } from '../postgres/repositories';

@Injectable()
export class UsersService {
  public constructor(private usersRepository: UsersRepository) {}

  public async deleteUser(userId: string) {
    const result = await this.usersRepository.deleteUser(userId);
    return result;
  }

  public async getUser(username: string) {
    const user = await this.usersRepository.findOne({ where: { username: username } });
    if (user) return user;
    return {} as UsersEntity;
  }
}
