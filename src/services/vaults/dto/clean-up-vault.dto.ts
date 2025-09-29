import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CleanUpVaultInput {
  @IsUUID()
  @IsString()
  @Field(() => String)
  creatorId: string;
}
