import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { CreateAndUpdateSocialAccountsInput } from '../creator-profiles';
import { SocialAccountsRepository } from '../rdb/repositories';

@Injectable()
export class SocialAccountsService {
  public constructor(private socialAccountsRepository: SocialAccountsRepository) {}

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
