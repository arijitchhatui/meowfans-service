import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from '../../util/enums';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { CreateImportQueueInput } from './dto/create-import.dto';
import { ExtractorService } from './extractor.service';

@Resolver()
export class ExtractorResolver {
  constructor(private extractorService: ExtractorService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.ADMIN])
  @Query(() => String)
  public async initiate(@CurrentUser() creatorId: string, @Args('input') input: CreateImportQueueInput) {
    return await this.extractorService.initiate(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.ADMIN])
  @Mutation(() => Boolean)
  public async terminate(@CurrentUser() userId: string) {
    return await this.extractorService.terminateAllJobs(userId);
  }
}
