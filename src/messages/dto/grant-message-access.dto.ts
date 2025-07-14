import { IsUUID } from 'class-validator';

export class GrantMessageAccessInput {
  @IsUUID()
  messageId: string;

  @IsUUID()
  fanId: string;
}
