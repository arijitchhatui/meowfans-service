export class SendMessageInput {
  senderId: string;

  recipientUserId: string;

  assetIds?: Array<string>;

  unlockAmount?: number;

  content: string;

  messageId?: string;

  isExclusive?: boolean;
}
