import { Field, ObjectType } from '@nestjs/graphql';
import { CreatorBlocksEntity } from '../../rdb/entities';

@ObjectType()
export class GetBlockedUsersOutput extends CreatorBlocksEntity {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;
}
