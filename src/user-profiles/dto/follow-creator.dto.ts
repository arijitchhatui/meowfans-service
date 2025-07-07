import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class FollowCreatorInput {
  @Field()
  @Column()
  @IsNotEmpty()
  creatorId: string;
}
