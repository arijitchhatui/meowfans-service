import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { DownloaderService } from './downloader.service';
import { UploadVaultInput } from './dto';

@Resolver()
export class DownloaderResolver {
  constructor(private downloaderService: DownloaderService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => String)
  public async uploadVault(@CurrentUser() creatorId: string, @Args('input') input: UploadVaultInput) {
    return await this.downloaderService.uploadVault(creatorId, input);
  }
}
