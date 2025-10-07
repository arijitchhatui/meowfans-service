import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '../../postgres/entities';

@ObjectType()
export class GetUserOutput extends UsersEntity {
  @Field(() => Int)
  fulfilledCount: number;

  @Field(() => Int)
  processingCount: number;

  @Field(() => Int)
  pendingCount: number;

  @Field(() => Int)
  rejectedCount: number;
}
