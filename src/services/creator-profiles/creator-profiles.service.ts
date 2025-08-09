import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { PaginationInput } from '../../lib/helpers';
import {
  CreatorBlocksRepository,
  CreatorFollowsRepository,
  CreatorProfilesRepository,
  CreatorRestrictsRepository,
  SocialAccountsRepository,
  UsersRepository,
} from '../rdb/repositories';
import { CreateAndUpdateSocialAccountsInput, DeleteFollowerInput, UpdateCreatorProfileInput } from './dto';
import { BlockFanInput } from './dto/block-fan.dto';
import { RestrictFanInput } from './dto/restrict-fan.dto';

@Injectable()
export class CreatorProfilesService {
  public constructor(
    private creatorRestrictsRepository: CreatorRestrictsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
    private creatorFollowsRepository: CreatorFollowsRepository,
    private socialAccountsRepository: SocialAccountsRepository,
    private creatorBlocksRepository: CreatorBlocksRepository,
    private usersRepository: UsersRepository,
  ) {}

  public async getCreatorProfile(creatorId: string) {
    return await this.creatorProfilesRepository.findOneOrFail({ where: { creatorId }, relations: { user: true } });
  }

  public async updateCreatorProfile(creatorId: string, input: UpdateCreatorProfileInput) {
    const { username, avatarUrl, bannerUrl, ...rest } = input;

    const creatorProfile = await this.creatorProfilesRepository.findOneOrFail({
      where: { creatorId },
      relations: { user: true },
    });

    await this.usersRepository.save(Object.assign(creatorProfile.user, shake({ username, bannerUrl, avatarUrl })));

    return await this.creatorProfilesRepository.save(Object.assign(creatorProfile, shake(rest)));
  }

  public async getFollowers(creatorId: string, input: PaginationInput) {
    return await this.creatorFollowsRepository.getFollowers(creatorId, input);
  }

  public async deleteFollower(creatorId: string, input: DeleteFollowerInput): Promise<boolean> {
    const result = await this.creatorFollowsRepository.delete({
      creatorId: creatorId,
      fanId: input.fanId,
    });

    return !!result;
  }

  public async blockFan(creatorId: string, input: BlockFanInput): Promise<boolean> {
    const wasBlocked = await this.creatorBlocksRepository.findOne({
      where: { creatorId: creatorId, fanId: input.fanId },
    });
    if (wasBlocked) return true;

    const result = await this.creatorBlocksRepository.save({
      creatorId: creatorId,
      fanId: input.fanId,
    });
    return !!result;
  }

  public async getBlockedUsers(creatorId: string, input: PaginationInput) {
    return await this.creatorBlocksRepository.getBlockedUsers(creatorId, input);
  }

  public async unBlockFan(creatorId: string, input: BlockFanInput): Promise<boolean> {
    const blocked = await this.creatorBlocksRepository.delete({ fanId: input.fanId, creatorId: creatorId });

    return !!blocked.affected;
  }

  public async getRestrictedUsers(creatorId: string, input: PaginationInput) {
    return await this.creatorRestrictsRepository.getRestrictedUsers(creatorId, input);
  }

  public async restrictFan(creatorId: string, input: RestrictFanInput): Promise<boolean> {
    const wasRestricted = await this.creatorRestrictsRepository.findOne({ where: { creatorId, fanId: input.fanId } });
    if (wasRestricted) return true;

    const result = await this.creatorRestrictsRepository.save({ creatorId: creatorId, fanId: input.fanId });

    return !!result;
  }

  public async unRestrictFan(creatorId: string, input: RestrictFanInput): Promise<boolean> {
    const restricted = await this.creatorRestrictsRepository.delete({
      creatorId: creatorId,
      fanId: input.fanId,
    });
    return !!restricted.affected;
  }

  public async updateSocialAccounts(creatorId: string, input: CreateAndUpdateSocialAccountsInput) {
    const account = await this.socialAccountsRepository.findOneOrFail({ where: { creatorId } });
    return await this.socialAccountsRepository.save(Object.assign(account, shake(input)));
  }

  public async createSocialAccounts(creatorId: string, input: CreateAndUpdateSocialAccountsInput) {
    const account = this.socialAccountsRepository.create({
      creatorId: creatorId,
      faceBook: input.faceBook,
      instagram: input.website,
      twitter: input.twitter,
    });

    return await this.socialAccountsRepository.save(account);
  }
}
