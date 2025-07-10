import { BadRequestException, Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { CreatorProfilesRepository, UserProfilesRepository } from 'src/rdb/repositories';
import { CreatorFollowsRepository } from 'src/rdb/repositories/creator-follows.repository';
import { FollowCreatorInput } from './dto/follow-creator.dto';
import { UnFollowCreatorInput } from './dto/unfollow-creator.dto';
import { UpdateUserProfileInput } from './dto/update-userProfile.dto';

@Injectable()
export class UserProfilesService {
  public constructor(
    private userProfilesRepository: UserProfilesRepository,
    private creatorFollowsRepository: CreatorFollowsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
  ) {}

  public async getUserProfile(userId: string) {
    return this.userProfilesRepository.findOneOrFail({ where: { userId }, relations: { user: true } });
  }

  public async updateUserProfile(userId: string, input: UpdateUserProfileInput) {
    const userProfile = await this.userProfilesRepository.findOneOrFail({ where: { userId } });

    const exists = await this.userProfilesRepository.findOne({ where: { username: input.username } });
    if (exists) throw new BadRequestException('Username already exists!');

    return this.userProfilesRepository.save(Object.assign(userProfile, shake(input)));
  }

  public async followCreator(userId: string, input: FollowCreatorInput) {
    const followedCreator = this.creatorFollowsRepository.create({
      followingUserId: userId,
      followedCreatorId: input.creatorId,
    });
    return await this.creatorFollowsRepository.save(followedCreator);
  }

  public async unFollowCreator(userId: string, input: UnFollowCreatorInput) {
    const unFollowed = await this.creatorFollowsRepository.delete({
      followedCreatorId: input.creatorId,
      followingUserId: userId,
    });
    return !!unFollowed.affected;
  }

  public async getFollowing(userId: string) {
    return await this.userProfilesRepository.find({
      where: { userId },
      relations: { following: true },
    });
  }
}
