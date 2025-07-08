import { BadRequestException, Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { CreatorFollowsEntity } from 'src/rdb/entities';
import { CreatorBlocksRepository, CreatorFollowsRepository, CreatorProfilesRepository } from 'src/rdb/repositories';
import { CreatorRestrictsRepository } from 'src/rdb/repositories/creator-restricts.repository';
import { DeleteFollowerInput, UpdateCreatorProfileInput } from './dto';
import { BlockFanInput } from './dto/block-fan.dto';
import { RestrictFanInput } from './dto/restrict-fan.dto';

@Injectable()
export class CreatorProfilesService {
  public constructor(
    private creatorRestrictsRepository: CreatorRestrictsRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
    private creatorFollowsRepository: CreatorFollowsRepository,
    private creatorBlocksRepository: CreatorBlocksRepository,
  ) {}

  public async getCreatorProfile(creatorId: string) {
    return this.creatorProfilesRepository.findOneOrFail({ where: { creatorId }, relations: { user: true } });
  }

  public async updateCreatorProfile(creatorId: string, input: UpdateCreatorProfileInput) {
    const creatorProfile = await this.creatorProfilesRepository.findOneOrFail({
      where: { creatorId },
      relations: { user: true },
    });

    if (input.username && input.username !== creatorProfile.username) {
      const exists = await this.creatorProfilesRepository.findOne({ where: { username: input.username } });
      if (exists) throw new BadRequestException('Username already exists');
    }

    return this.creatorProfilesRepository.save(Object.assign(creatorProfile, shake(input)));
  }

  public async getFollowers(creatorId: string): Promise<CreatorFollowsEntity[]> {
    const creatorProfile = await this.creatorProfilesRepository.findOneOrFail({
      where: { creatorId },
      relations: { followers: true },
    });
    return creatorProfile.followers;
  }

  public async deleteFollower(creatorId: string, input: DeleteFollowerInput): Promise<boolean> {
    const result = await this.creatorFollowsRepository.delete({
      followedCreatorId: creatorId,
      followingUserId: input.userId,
    });
    return !!result;
  }

  public async blockFan(creatorId: string, input: BlockFanInput): Promise<boolean> {
    const wasBlocked = await this.creatorBlocksRepository.findOne({
      where: { blockingCreatorId: creatorId, blockedUserId: input.userId },
    });
    if (wasBlocked) return true;
    const result = await this.creatorBlocksRepository.save({
      blockingCreatorId: creatorId,
      blockedUserId: input.userId,
    });
    return !!result;
  }

  public async unBlockFan(creatorId: string, input: BlockFanInput): Promise<boolean> {
    const blocked = await this.creatorBlocksRepository.delete({
      blockedUserId: input.userId,
      blockingCreatorId: creatorId,
    });
    return !!blocked.affected;
  }

  public async restrictFan(creatorId: string, input: RestrictFanInput): Promise<boolean> {
    const wasRestricted = await this.creatorRestrictsRepository.findOneOrFail({
      where: { creatorId, restrictedUserId: input.userId },
    });
    if (wasRestricted) return true;
    const result = await this.creatorRestrictsRepository.save({
      creatorId: creatorId,
      restrictedUserId: input.userId,
    });
    return !!result;
  }

  public async unRestrictFan(creatorId: string, input: RestrictFanInput): Promise<boolean> {
    const restricted = await this.creatorRestrictsRepository.delete({
      creatorId: creatorId,
      restrictedUserId: input.userId,
    });
    return !!restricted.affected;
  }
}
