import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '../../postgres/entities';

@ObjectType()
export class ExtendedUsersEntity extends UsersEntity {
  @Field(() => Int)
  vaultCount: number;

  @Field(() => Int)
  assetCount: number;

  @Field(() => Int)
  pendingObjectCount: number;

  @Field(() => Int)
  processingObjectCount: number;

  @Field(() => Int)
  fulfilledObjectCount: number;

  @Field(() => Int)
  rejectedObjectCount: number;
}

@ObjectType()
export class GetAllCreatorsOutput {
  @Field(() => [ExtendedUsersEntity])
  creators: ExtendedUsersEntity[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Boolean)
  hasPrev: boolean;

  @Field(() => Boolean)
  hasNext: boolean;
}
