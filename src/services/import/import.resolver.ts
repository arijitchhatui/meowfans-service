import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'libs/enums/user-roles';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { CreateImportInput } from './dto/create-import.dto';
import { ImportService } from './import.service';

@Resolver()
export class ImportResolver {
  constructor(private importService: ImportService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => String)
  public async initiate(@CurrentUser() creatorId: string, @Args('input') input: CreateImportInput) {
    return await this.importService.initiate(creatorId, input);
  }
}
