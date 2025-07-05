import { Injectable } from '@nestjs/common';
import { CreatorProfilesRepository } from 'src/rdb/repositories';

@Injectable()
export class CreatorProfilesService {
  public constructor(private creatorProfilesRepository: CreatorProfilesRepository) {}

  public async getCreatorProfile(creatorId: string) {
    return this.creatorProfilesRepository.findOneOrFail({ where: { creatorId }, relations: { user: true } });
  }
}
