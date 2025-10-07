import { PaginationInput } from '@app/helpers';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { VaultObjectsEntity } from '../postgres/entities';
import { GetAllObjectsCountOutput, GetDefaultVaultObjectsOutput, GetDefaultVaultsOutput } from './dto';
import { VaultsService } from './vaults.service';

@Resolver()
export class VaultsResolver {
  constructor(private vaultsService: VaultsService) {}

  @Query(() => GetDefaultVaultObjectsOutput)
  public async getVaultObjectsByVaultId(@Args('input') input: PaginationInput): Promise<GetDefaultVaultObjectsOutput> {
    return await this.vaultsService.getVaultObjectsByVaultId(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [VaultObjectsEntity])
  public async getCreatorVaultObjects(
    @CurrentUser() creatorId: string,
    @Args('input') input: PaginationInput,
  ): Promise<VaultObjectsEntity[]> {
    return await this.vaultsService.getCreatorVaultObjects(creatorId, input);
  }

  @Query(() => GetDefaultVaultsOutput)
  public async getDefaultVaults(@Args('input') input: PaginationInput): Promise<GetDefaultVaultsOutput> {
    return await this.vaultsService.getDefaultVaults(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => String)
  public async updatePreviewOfVaults(@CurrentUser() adminId: string) {
    return await this.vaultsService.updatePreviewOfVaults(adminId);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.ADMIN])
  @Query(() => Int)
  public async getTotalObjectsAsType(@Args('input') input: PaginationInput): Promise<number> {
    return await this.vaultsService.getTotalObjectsAsType(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Query(() => GetAllObjectsCountOutput)
  public async getCountOfObjectsOfEachType(): Promise<GetAllObjectsCountOutput> {
    return await this.vaultsService.getCountOfObjectsOfEachType();
  }
}
