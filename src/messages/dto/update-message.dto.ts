import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class UpdateMessageInput {
  @Field()
  @Column()
  @IsUUID()
  messageId: string;

  @Field()
  @Column()
  message: string;
}
