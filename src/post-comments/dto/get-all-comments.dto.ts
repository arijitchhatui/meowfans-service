import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetAllCommentsInput {
  @Field()
  offset: number;
}
