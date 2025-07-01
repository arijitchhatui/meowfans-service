import { BadRequestException, Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { UserProfilesRepository } from 'src/rdb/repositories';
import { UpdateUserInput } from './dto';

@Injectable()
export class UsersService {
  public constructor(private userProfilesRepository: UserProfilesRepository) {}

  public async getUserProfile(userId: string) {
    return this.userProfilesRepository.findOneOrFail({ where: { userId }, relations: { user: true } });
  }

  public async updateUserProfile(userId: string, input: UpdateUserInput) {
    const userProfile = await this.userProfilesRepository.findOneOrFail({
      where: { userId },
      relations: { user: true },
    });
    const exists = await this.userProfilesRepository.findOne({ where: { username: input.username } });
    if (exists) throw new BadRequestException('Username already exists!');

    return this.userProfilesRepository.save(Object.assign(userProfile, shake(input)));
  }
}
