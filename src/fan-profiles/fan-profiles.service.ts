import { BadRequestException, Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { CreatorProfilesRepository, FanProfilesRepository } from 'src/rdb/repositories';
import { CreatorFollowsRepository } from 'src/rdb/repositories/creator-follows.repository';
import { GetFollowingInput } from './dto';
import { FollowCreatorInput } from './dto/follow-creator.dto';
import { UnFollowCreatorInput } from './dto/unfollow-creator.dto';
import { UpdateUserProfileInput } from './dto/update-fan-profile.dto';

@Injectable()
export class FanProfilesService {
  public constructor(
    private fanProfilesRepository: FanProfilesRepository,
    private creatorFollowsRepository: CreatorFollowsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
  ) {}

  public async getFanProfile(fanId: string) {
    return this.fanProfilesRepository.findOneOrFail({ where: { fanId }, relations: { user: true } });
  }

  public async updateFanProfile(fanId: string, input: UpdateUserProfileInput) {
    const fanProfile = await this.fanProfilesRepository.findOneOrFail({ where: { fanId } });

    if (input.username && input.username !== fanProfile.username) {
      const exists = await this.fanProfilesRepository.findOne({ where: { username: input.username } });
      if (exists) throw new BadRequestException('Username already exists!');
    }

    return this.fanProfilesRepository.save(Object.assign(fanProfile, shake(input)));
  }

  public async followCreator(fanId: string, input: FollowCreatorInput) {
    const followedCreator = this.creatorFollowsRepository.create({
      fanId: fanId,
      creatorId: input.creatorId,
    });
    return await this.creatorFollowsRepository.save(followedCreator);
  }

  public async unFollowCreator(fanId: string, input: UnFollowCreatorInput) {
    const unFollowed = await this.creatorFollowsRepository.delete({
      creatorId: input.creatorId,
      fanId: fanId,
    });
    return !!unFollowed.affected;
  }

  public async getFollowing(fanId: string, input: GetFollowingInput) {
    return await this.creatorFollowsRepository.getFollowing(fanId, input);
  }
}
