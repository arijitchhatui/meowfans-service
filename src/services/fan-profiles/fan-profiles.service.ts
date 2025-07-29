import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { PaginationInput } from '../../lib/helpers';
import { CreatorFollowsRepository, FanProfilesRepository, UsersRepository } from '../rdb/repositories';
import { FollowCreatorInput } from './dto/follow-creator.dto';
import { UnFollowCreatorInput } from './dto/unfollow-creator.dto';
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

  public async followCreator(fanId: string, input: FollowCreatorInput) {
    const hasFollowed = await this.creatorFollowsRepository.findOne({
      where: { fanId: fanId, creatorId: input.creatorId },
    });

    if (hasFollowed) return true;

    const followed = await this.creatorFollowsRepository.save({ fanId: fanId, creatorId: input.creatorId });
    return !!followed;
  }

  public async unFollowCreator(fanId: string, input: UnFollowCreatorInput) {
    const unFollowed = await this.creatorFollowsRepository.delete({ creatorId: input.creatorId, fanId: fanId });
    return !!unFollowed.affected;
  }

  public async getFollowing(fanId: string, input: PaginationInput) {
    return await this.creatorFollowsRepository.getFollowing(fanId, input);
  }
}
