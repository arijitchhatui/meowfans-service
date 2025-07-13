import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetCreatorAssetsInput {
  @Field()
  offset: number;
}
