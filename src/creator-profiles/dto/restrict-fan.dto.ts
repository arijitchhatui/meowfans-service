import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RestrictFanInput {
  @Field()
  userId: string;
}
