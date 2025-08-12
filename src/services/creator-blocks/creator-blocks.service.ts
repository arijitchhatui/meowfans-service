import { Injectable } from '@nestjs/common';
import { PaginationInput } from '../../lib/helpers';
import { BlockFanInput } from '../creator-profiles';
import { CreatorBlocksEntity } from '../rdb/entities';
import { CreatorBlocksRepository } from '../rdb/repositories';

@Injectable()
export class CreatorBlocksService {
  public constructor(private creatorBlocksRepository: CreatorBlocksRepository) {}

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

  public async getBlockedUsers(creatorId: string, input: PaginationInput): Promise<CreatorBlocksEntity[]> {
    return await this.creatorBlocksRepository.getBlockedUsers(creatorId, input);
  }

  public async unBlockFan(creatorId: string, input: BlockFanInput): Promise<boolean> {
    const blocked = await this.creatorBlocksRepository.delete({ fanId: input.fanId, creatorId: creatorId });

    return !!blocked.affected;
  }
}
