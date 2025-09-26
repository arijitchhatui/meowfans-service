import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '../../postgres/entities';

@ObjectType()
export class GetAllCreatorsOutput {
  @Field(() => [UsersEntity])
  creators: UsersEntity[];

  @Field(() => Int)
  count: number;
}
