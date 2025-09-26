import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { CreatorProfilesRepository, UsersRepository } from '../postgres/repositories';
import { UpdateCreatorProfileInput } from './dto';

@Injectable()
export class CreatorProfilesService {
  public constructor(
    private creatorProfilesRepository: CreatorProfilesRepository,
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
}
