import { Injectable } from '@nestjs/common';
import { CreatorProfilesRepository, UsersRepository } from '../rdb/repositories';
import { UploadsService } from '../uploads';

@Injectable()
export class UsersService {
  public constructor(
    private usersRepository: UsersRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
    private uploadsService: UploadsService,
  ) {}
  public async migrate() {
    const users = await this.usersRepository.find();
    for (const user of users) {
      // const fanUsername = `fan-${randomBytes(3).toString('hex')}`;
      // const creatorUsername = `creator-${randomBytes(3).toString('hex')}`;
      const isCreator = await this.creatorProfilesRepository.findOne({ where: { creatorId: user.id } });
      if (isCreator) {
        await this.usersRepository.update(
          { id: user.id },
          {
            avatarUrl: this.uploadsService.generateDefaultCreatorAvatarUrl(user.firstName + user.lastName),
            bannerUrl: this.uploadsService.generateDefaultCreatorBannerUrl(),
          },
        );
      } else
        await this.usersRepository.update(
          { id: user.id },
          {
            avatarUrl: this.uploadsService.generateDefaultFanAvatarUrl(user.firstName + user.lastName),
            bannerUrl: this.uploadsService.generateDefaultFanBannerUrl(),
          },
        );
    }
    return await this.usersRepository.find();
  }
}
