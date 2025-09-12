import { HasAssetsForExclusivePropValidator } from '@app/validators';
import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsUUID, Validate } from 'class-validator';

@InputType()
export class SendMessageFromCreatorInput {
  @Field()
  content: string;

  @Field(() => Int)
  unlockAmount: number;

  @Field()
  @IsUUID()
  senderId: string;

  @Field()
  @IsUUID()
  recipientUserId: string;

  @Field({ defaultValue: true })
  @Validate(HasAssetsForExclusivePropValidator)
  isExclusive: boolean;

  @Field(() => [ID])
  assetIds: Array<string>;

  @IsOptional()
  @Field(() => String, { nullable: true })
  messageId: string;
}
