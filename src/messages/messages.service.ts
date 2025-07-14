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

  public async createChannel(fanId: string, input: CreateChannelInput) {
    const channel = await this.messageChannelsRepository.findOne({
      where: { id: input.channelId },
    });
    if (channel) return channel;

    const newChannel = this.messageChannelsRepository.create({
      fanId: fanId,
      creatorId: input.creatorId,
      fanLastSeenAt: new Date(),
      fanLastSentAt: new Date(),
    });

    return await this.messageChannelsRepository.save(newChannel);
  }

  public async updateChannel(creatorId: string, input: UpdateChannelInput) {
    const { channelId, ...rest } = input;
    const channel = await this.messageChannelsRepository.findOneOrFail({
      where: { creatorId, id: channelId },
    });
    return await this.messageChannelsRepository.save(Object.assign(channel, shake(rest)));
  }

  public async getChannels(fanId: string) {
    return await this.messageChannelsRepository.getChannels(fanId);
  }

  public async getChannel(fanId: string, input: GetChannelInput) {
    return await this.messageChannelsRepository.getChannel(fanId, input);
  }

  public async getChannelMessages(fanId: string, input: GetMessagesInput) {
    const messages = await this.messagesRepository.getChannelMessages(fanId, input);

    return await Promise.all(
      messages.map(async (msg) => {
        if (!msg.isExclusive) return msg;

        return { ...msg };
      }),
    );
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

  public async updateMessage(fanId: string, input: UpdateMessageInput) {
    const message = await this.messagesRepository.findOneOrFail({ where: { id: input.messageId, senderId: fanId } });
    return await this.messagesRepository.save(Object.assign(message, shake(input)));
  }

  public async deleteMessages(fanId: string, input: DeleteMessagesInput) {
    const deleteResult = await Promise.all(
      input.messageIds.map(async (messageId) => {
        const message = await this.messagesRepository.findOne({ where: { id: messageId, senderId: fanId } });
        if (message) {
          await this.messagesRepository.delete({ id: messageId });
          return true;
        }
        return false;
      }),
    );
    return deleteResult.some((deleted) => deleted);
  }

  public async deleteMessage(fanId: string, input: DeleteMessageInput) {
    await this.messagesRepository.findOneOrFail({ where: { id: input.messageId, senderId: fanId } });
    const result = await this.messagesRepository.delete({ id: input.messageId, senderId: fanId });
    return !!result.affected;
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
      channelId: input.channelId,
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
      channelId: input.channelId,
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
