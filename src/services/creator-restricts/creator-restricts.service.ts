import { Injectable } from '@nestjs/common';
import { PaginationInput } from '../../lib/helpers';
import { RestrictFanInput } from '../creator-profiles';
import { CreatorRestrictsRepository } from '../rdb/repositories';

@Injectable()
export class CreatorRestrictsService {
  public constructor(private creatorRestrictsRepository: CreatorRestrictsRepository) {}

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
}
