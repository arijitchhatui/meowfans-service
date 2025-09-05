import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { UserRoles } from '../service.constants';
import { CreateScrapeInput } from './dto/create-scrape.dto';
import { ScraperService } from './scraper.service';

@Resolver()
export class ScraperResolver {
  constructor(private scraperService: ScraperService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => String)
  public async initiate(@CurrentUser() creatorId: string, @Args('input') input: CreateScrapeInput) {
    return await this.scraperService.initiate(creatorId, input);
  }
}
