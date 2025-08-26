import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaginationInput } from '../../lib/helpers';
import { DeleteFollowerInput } from '../creator-profiles';
import { FollowCreatorInput, UnFollowCreatorInput } from '../fan-profiles';
import { CreatorFollowsEntity } from '../postgres/entities';
import { CreatorFollowsRepository } from '../postgres/repositories';

@Injectable()
export class CreatorFollowsService {
  private readonly logger = new Logger(CreatorFollowsService.name);

  public constructor(private creatorFollowsRepository: CreatorFollowsRepository) {}

  public async getFollowers(creatorId: string, input: PaginationInput): Promise<CreatorFollowsEntity[]> {
    return await this.creatorFollowsRepository.getFollowers(creatorId, input);
  }

  public async deleteFollower(creatorId: string, input: DeleteFollowerInput): Promise<boolean> {
    const result = await this.creatorFollowsRepository.delete({
      creatorId: creatorId,
      fanId: input.fanId,
    });

    return !!result;
  }

  public async followCreator(fanId: string, input: FollowCreatorInput): Promise<CreatorFollowsEntity> {
    const { creatorId } = input;

    this.logger.log({ message: 'followCreator', fanId });

    await this.avertSelfFollow(fanId, creatorId);

    const followExists = await this.creatorFollowsRepository.findOne({
      where: { fanId: fanId, creatorId: creatorId },
    });

    if (followExists) return followExists;

    return await this.creatorFollowsRepository.restoreOrCreateFollow({ fanId, creatorId });
  }

  public async unFollowCreator(fanId: string, input: UnFollowCreatorInput) {
    const unFollowed = await this.creatorFollowsRepository.delete({ creatorId: input.creatorId, fanId: fanId });
    return !!unFollowed.affected;
  }

  public async getFollowing(fanId: string, input: PaginationInput): Promise<CreatorFollowsEntity[]> {
    return await this.creatorFollowsRepository.getFollowing(fanId, input);
  }

  private async avertSelfFollow(fanId: string, creatorId: string): Promise<void> {
    if (fanId === creatorId) {
      this.logger.error({ message: 'SELF FOLLOW ERROR!' });
      throw new BadRequestException({ message: 'You can"t follow yourself' });
    }
  }
}
