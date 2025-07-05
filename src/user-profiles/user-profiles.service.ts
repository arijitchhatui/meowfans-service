import { Injectable } from '@nestjs/common';
import { UserProfilesRepository } from 'src/rdb/repositories';

@Injectable()
export class UserProfilesService {
  public constructor(private userProfilesRepository: UserProfilesRepository) {}

  public async getUserProfile(userId: string) {
    return this.userProfilesRepository.findOneOrFail({ where: { userId }, relations: { user: true } });
  }
}
