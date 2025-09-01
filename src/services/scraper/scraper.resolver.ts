import { Args, Query, Resolver } from '@nestjs/graphql';
import { CreateScrapeInput } from './dto/create-scrape.dto';
import { UploadMediaOutput } from './dto/upload-media.out';
import { ScraperService } from './scraper.service';

@Resolver()
export class ScraperResolver {
  constructor(private puppeteerService: ScraperService) {}

  // @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Query(() => [UploadMediaOutput])
  public async initiate(
    // @CurrentUser() creatorId: string,
    @Args('input') input: CreateScrapeInput,
  ) {
    const creatorId = 'b4c7a849-9641-4897-a614-1ef09047cc0e';
    return this.puppeteerService.initiate(creatorId, input);
  }
}
