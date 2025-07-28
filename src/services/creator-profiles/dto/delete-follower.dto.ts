import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteFollowerInput {
  @Field()
  fanId: string;
}
