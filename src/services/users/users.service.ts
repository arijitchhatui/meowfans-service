import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { cluster } from 'radash';
import { QueueTypes } from '../../util/enums';
import { UsersEntity } from '../postgres/entities';
import { AssetsRepository, UsersRepository } from '../postgres/repositories';
import { UpdateUsersInput } from './dto';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  public constructor(
    private readonly usersRepository: UsersRepository,
    private readonly assetsRepository: AssetsRepository,
    @InjectQueue(QueueTypes.CREATOR_UPDATE_QUEUE) private readonly updateCreatorQueue: Queue<UpdateUsersInput>,
  ) {}

  public async deleteUser(userId: string) {
    const result = await this.usersRepository.deleteUser(userId);
    return result;
  }

  public async getUser(username: string) {
    const user = await this.usersRepository.findOne({ where: { username: username } });
    if (user) return user;
    return {} as UsersEntity;
  }

  public async updateAllCreatorProfiles(input: UpdateUsersInput) {
    await this.updateCreatorQueue.add(input);

    return 'Updating started';
  }

  public async handleUpdateCreator(input: UpdateUsersInput) {
    const isAdmin = await this.usersRepository.isAdmin(input.adminId);
    if (!isAdmin) return;

    const creators = await this.usersRepository.find();
    const creatorIds = creators.map((creator) => creator.id);

    try {
      for (const chunk of cluster(Array.from(creatorIds), 5)) {
        await Promise.all(
          chunk.map(async (creatorId) => {
            const creator = await this.usersRepository.findOne({ where: { id: creatorId } });
            const creatorAsset = await this.assetsRepository.findOne({ where: { creatorId } });
            if (creator && creatorAsset) {
              await this.usersRepository.update(
                { id: creator.id },
                {
                  avatarUrl: creatorAsset.rawUrl,
                  bannerUrl: creatorAsset.rawUrl,
                },
              );
              this.logger.log({ UPDATED: creator.username });
            }
          }),
        );
      }
    } catch (error) {
      this.logger.error(error);
    } finally {
      this.logger.log({ MESSAGE: 'UPDATED ALL CREATOR PROFILES' });
    }
  }
}
