import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueTypes } from '../../util/enums';
import { UpdateUsersInput } from './dto';
import { UsersService } from './users.service';

@Processor(QueueTypes.CREATOR_UPDATE_QUEUE)
export class UsersConsumerService {
  private logger = new Logger(UsersConsumerService.name);

  constructor(private usersService: UsersService) {}

  @Process()
  public async updateCreatorProfileBannerAndAvatar(input: Job<UpdateUsersInput>) {
    this.logger.log({ MESSAGE: 'STARTED UPDATING CREATORS' });

    try {
      await this.usersService.handleUpdateCreator(input.data);
    } catch {
      console.log('Consumer error while updating');
    }
  }
}
