import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

@InputType()
export class DeleteMessagesInput {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(25)
  @IsUUID('3', { each: true })
  @Field(() => [ID])
  messageIds: Array<string>;
}
