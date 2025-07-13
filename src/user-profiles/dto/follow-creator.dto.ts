import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class FollowCreatorInput {
  @Field()
  @IsNotEmpty()
  creatorId: string;
}
