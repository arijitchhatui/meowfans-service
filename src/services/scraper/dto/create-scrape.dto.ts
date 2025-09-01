import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateScrapeInput {
  @IsNotEmpty()
  @Field(() => String)
  url: string;

  @Field({ defaultValue: false })
  hasBranch: boolean;
}

export class CreateScrapeQueueInput extends CreateScrapeInput {
  creatorId: string;
}
