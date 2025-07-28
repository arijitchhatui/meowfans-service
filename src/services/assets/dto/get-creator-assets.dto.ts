import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetCreatorAssetsInput {
  @Field(() => Int)
  offset: number;
}
