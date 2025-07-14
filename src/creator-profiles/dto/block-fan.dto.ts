import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BlockFanInput {
  @Field()
  fanId: string;
}
