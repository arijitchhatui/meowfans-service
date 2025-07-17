import { profanity } from '@2toad/profanity';
import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import {
  MessageAccessRepository,
  MessageChannelsRepository,
  MessageReactionsRepository,
  MessageRepliesRepository,
  MessagesRepository,
} from 'src/rdb/repositories';
import {
  CreateChannelInput,
  DeleteMessageInput,
  DeleteMessagesInput,
  GetChannelInput,
  GetMessagesInput,
  SendReactionInput,
  SendReplyToCreatorInput,
  SendReplyToFanInput,
  SendToCreatorMessageInput,
  UpdateChannelInput,
  UpdateMessageInput,
} from './dto';
import { SendToFanMessageInput } from './dto/send-to-fan-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private messageReactionsRepository: MessageReactionsRepository,
    private messageChannelsRepository: MessageChannelsRepository,
    private messageRepliesRepository: MessageRepliesRepository,
    private messageAccessRepository: MessageAccessRepository,
    private messagesRepository: MessagesRepository,
  ) {}

  public async createChannel(input: CreateChannelInput) {
    const channel = await this.messageChannelsRepository.findOne({
      where: { fanId: input.fanId, creatorId: input.creatorId },
    });
    if (channel) return channel;

    return await this.messageChannelsRepository.save({
      fanId: input.fanId,
      creatorId: input.creatorId,
      fanLastSeenAt: new Date(),
      fanLastSentAt: new Date(),
    });
  }

  public async updateChannel(creatorId: string, input: UpdateChannelInput) {
    const channel = await this.messageChannelsRepository.findOneOrFail({ where: { creatorId, id: input.channelId } });

    return await this.messageChannelsRepository.save(Object.assign(channel, shake(input)));
  }

  public async getChannels(userId: string) {
    return await this.messageChannelsRepository.getChannels(userId);
  }

  public async getChannel(userId: string, input: GetChannelInput) {
    return await this.messageChannelsRepository.getChannel(userId, input);
  }

  public async getChannelMessages(userId: string, input: GetMessagesInput) {
    return await this.messagesRepository.getChannelMessages(userId, input);
  }

  public async sendMessageToFan(creatorId: string, input: SendToFanMessageInput) {
    const newMessage = this.messagesRepository.create({
      senderId: creatorId,
      recipientUserId: input.fanId,
      channelId: input.channelId,
      content: input.message,
      isExclusive: input.isExclusive,
      unlockPrice: input.unlockPrice ?? null,
    });

    return await this.messagesRepository.save(newMessage);
  }

  public async sendMessageToCreator(fanId: string, input: SendToCreatorMessageInput) {
    const newMessage = this.messagesRepository.create({
      senderId: fanId,
      recipientUserId: input.creatorId,
      channelId: input.channelId,
      content: profanity.censor(input.message),
      isExclusive: false,
    });

    return await this.messagesRepository.save(newMessage);
  }

  public async updateMessage(userId: string, input: UpdateMessageInput) {
    const message = await this.messagesRepository.findOneOrFail({ where: { id: input.messageId, senderId: userId } });
    return await this.messagesRepository.save(Object.assign(message, shake(input)));
  }

  public async deleteMessages(userId: string, input: DeleteMessagesInput) {
    const deleteResult = await Promise.all(
      input.messageIds.map(async (messageId) => {
        const message = await this.messagesRepository.findOne({ where: { id: messageId, senderId: userId } });
        if (message) {
          await this.messagesRepository.delete({ id: messageId });
          return true;
        }
        return false;
      }),
    );
    return deleteResult.some((deleted) => deleted);
  }

  public async deleteMessage(userId: string, input: DeleteMessageInput) {
    await this.messagesRepository.findOneOrFail({ where: { id: input.messageId, senderId: userId } });
    const { affected } = await this.messagesRepository.delete({ id: input.messageId, senderId: userId });
    return !!affected;
  }

  public async sendOrDeleteMessageReaction(userId: string, input: SendReactionInput) {
    await this.messagesRepository.findOneOrFail({ where: { id: input.messageId } });

    const hasReacted = await this.messageReactionsRepository.findOne({
      where: { messageId: input.messageId, userId: userId },
    });
    if (hasReacted) await this.messageReactionsRepository.delete({ messageId: input.messageId, userId: userId });

    const reaction = this.messageReactionsRepository.create({
      messageId: input.messageId,
      reaction: input.reaction,
      userId: userId,
    });

    return await this.messageReactionsRepository.save(reaction);
  }

  public async sendReplyToCreator(fanId: string, input: SendReplyToCreatorInput) {
    const repliedTo = await this.messagesRepository.findOneOrFail({ where: { id: input.messageId } });
    const replyMessage = this.messagesRepository.create({
      channelId: repliedTo.channelId,
      content: input.message,
      repliedTo,
      senderId: fanId,
      recipientUserId: input.creatorId,
    });
    await this.messageRepliesRepository.save({ messageId: input.messageId, replierId: fanId });
    return await this.messagesRepository.save(replyMessage);
  }

  public async sendReplyToFan(creatorId: string, input: SendReplyToFanInput) {
    const repliedTo = await this.messagesRepository.findOneOrFail({ where: { id: input.messageId } });
    const replyMessage = this.messagesRepository.create({
      channelId: repliedTo.channelId,
      content: input.message,
      repliedTo,
      senderId: creatorId,
      recipientUserId: input.fanId,
      isExclusive: input.isExclusive,
      unlockPrice: input.unlockPrice ?? null,
    });
    await this.messageRepliesRepository.save({ messageId: input.messageId, replierId: creatorId });
    return await this.messagesRepository.save(replyMessage);
  }
}
