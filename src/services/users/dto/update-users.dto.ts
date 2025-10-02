import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUsersInput {
  @Field(() => ID)
  adminId: string;
}
