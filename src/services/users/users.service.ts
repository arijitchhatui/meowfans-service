import { Injectable } from '@nestjs/common';
import { CreatorAssetsRepository, PostAssetsRepository } from '../rdb/repositories';

@Injectable()
export class UsersService {
  public constructor(
    private postAssets: PostAssetsRepository,
    private creatorAssets: CreatorAssetsRepository,
  ) {}
  public async migrate() {}
}
