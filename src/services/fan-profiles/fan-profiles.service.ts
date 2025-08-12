import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { CreatorFollowsRepository, FanProfilesRepository, UsersRepository } from '../rdb/repositories';
import { UpdateUserProfileInput } from './dto/update-fan-profile.dto';

@Injectable()
export class FanProfilesService {
  public constructor(
    private creatorFollowsRepository: CreatorFollowsRepository,
    private fanProfilesRepository: FanProfilesRepository,
    private usersRepository: UsersRepository,
  ) {}

  public async getFanProfile(fanId: string) {
    return this.fanProfilesRepository.findOneOrFail({ where: { fanId }, relations: { user: true } });
  }

  public async updateFanProfile(fanId: string, input: UpdateUserProfileInput) {
    const fanProfile = await this.fanProfilesRepository.findOneOrFail({ where: { fanId }, relations: { user: true } });

    await this.usersRepository.save(Object.assign(fanProfile.user, shake(input)));

    return this.fanProfilesRepository.save(fanProfile);
  }
}
