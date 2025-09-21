import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DownloaderService } from './downloader.service';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { UserRoles } from '../../util/enums';
import { VaultsEntity } from '../postgres/entities';
import { InsertVaultInput } from '../vaults/dto';

@Resolver()
export class DownloaderResolver {
  constructor(private downloaderService: DownloaderService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => [VaultsEntity])
  public async uploadVaults(@CurrentUser() creatorId: string, @Args('input') input: InsertVaultInput) {
    return await this.downloaderService.uploadVaults(creatorId, input);
  }
}
