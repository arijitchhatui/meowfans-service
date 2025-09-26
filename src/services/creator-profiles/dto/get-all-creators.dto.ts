import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '../../postgres/entities';

@ObjectType()
export class ExtendedUsersEntity extends UsersEntity {
  @Field(() => Int)
  vaultCount: number;
}

@ObjectType()
export class GetAllCreatorsOutput {
  @Field(() => [ExtendedUsersEntity])
  creators: ExtendedUsersEntity[];

  @Field(() => Int)
  count: number;
}
