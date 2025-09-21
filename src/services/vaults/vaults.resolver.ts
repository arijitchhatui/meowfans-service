import { PaginationInput } from '@app/helpers';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { VaultObjectsEntity, VaultsEntity } from '../postgres/entities';
import { VaultsService } from './vaults.service';

@Resolver()
export class VaultsResolver {
  constructor(private vaultsService: VaultsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [VaultsEntity])
  public async getCreatorVaults(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<VaultsEntity[]> {
    return await this.vaultsService.getCreatorVaults(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [VaultObjectsEntity])
  public async getCreatorVaultObjects(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<VaultObjectsEntity[]> {
    return await this.vaultsService.getCreatorVaultObjects(creatorId, input);
  }
}
