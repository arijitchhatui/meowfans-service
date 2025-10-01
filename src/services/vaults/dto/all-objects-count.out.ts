import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetAllObjectsCountOutput {
  @Field(() => Number)
  pending: number;

  @Field(() => Number)
  fulfilled: number;

  @Field(() => Number)
  rejected: number;

  @Field(() => Number)
  processing: number;
}
