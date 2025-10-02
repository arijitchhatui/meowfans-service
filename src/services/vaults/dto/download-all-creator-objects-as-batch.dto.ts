import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DownloadAllCreatorObjectsAsBatchInput {
  @Field(() => [ID])
  creatorIds: string[];
}
