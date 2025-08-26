import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { In } from 'typeorm';
import { PaginationInput } from '../../lib/helpers';
import { MessageChannelParticipantsService } from '../message-channel-participants';
import { MessageChannelsService } from '../message-channels';
import { MessageChannelsEntity, MessageReactionsEntity, MessagesEntity } from '../postgres/entities';
import {
  MessageAssetsRepository,
  MessageChannelsRepository,
  MessageReactionsRepository,
  MessageRepliesRepository,
  MessagesRepository,
} from '../postgres/repositories';
import {
  DeleteMessageInput,
  DeleteMessagesInput,
  SendMessageFromCreatorInput,
  SendMessageFromFanInput,
  SendMessageInput,
  SendReactionInput,
  UpdateMessageInput,
} from './dto';

@Injectable()
export class MessagesService {
  constructor(
    private messageChannelParticipantsService: MessageChannelParticipantsService,
    private messageReactionsRepository: MessageReactionsRepository,
    private messageChannelsRepository: MessageChannelsRepository,
    private messageRepliesRepository: MessageRepliesRepository,
    private messageAssetsRepository: MessageAssetsRepository,
    private messageChannelsService: MessageChannelsService,
    private messagesRepository: MessagesRepository,
  ) {}

  public async getChannelMessages(userId: string, input: PaginationInput) {
    return await this.messagesRepository.getChannelMessages(userId, input);
  }

  public async sendMessageFromCreator(creatorId: string, input: SendMessageFromCreatorInput): Promise<MessagesEntity> {
    const channel = await this.messageChannelsService.getOrCreateChannel({ creatorId, fanId: input.recipientUserId });

    const newMessage = await this.sendMessage({ channel, params: input });

    await this.messageChannelParticipantsService.update({
      messageChannelId: channel.id,
      userId: creatorId,
      lastSentAt: newMessage.createdAt,
    });

    await this.messageChannelsRepository.update({ id: channel.id }, { lastMessage: newMessage });

    return await this.messagesRepository.save(newMessage);
  }

  public async sendMessageFromFan(fanId: string, input: SendMessageFromFanInput): Promise<MessagesEntity> {
    const channel = await this.messageChannelsService.getOrCreateChannel({ fanId, creatorId: input.recipientUserId });

    const newMessage = await this.sendMessage({ channel, params: input });

    await this.messageChannelParticipantsService.update({
      messageChannelId: channel.id,
      userId: fanId,
      lastSentAt: newMessage.createdAt,
    });

    await this.messageChannelsRepository.update({ id: channel.id }, { lastMessage: newMessage });

    return await this.messagesRepository.save(newMessage);
  }

  public async updateMessage(userId: string, input: UpdateMessageInput): Promise<MessagesEntity> {
    const message = await this.messagesRepository.findOneOrFail({ where: { id: input.messageId, senderId: userId } });
    return await this.messagesRepository.save(Object.assign(message, shake(input)));
  }

  public async deleteMessages(userId: string, input: DeleteMessagesInput): Promise<boolean> {
    const messages = await this.messagesRepository.find({ where: { id: In(input.messageIds), senderId: userId } });

    if (messages.length) {
      const deletableIds = messages.map((m) => m.id);
      return !!(await this.messagesRepository.delete({ id: In(deletableIds) })).affected;
    }
    return false;
  }

  public async deleteMessage(userId: string, input: DeleteMessageInput): Promise<boolean> {
    await this.messagesRepository.findOneOrFail({ where: { id: input.messageId, senderId: userId } });
    const { affected } = await this.messagesRepository.delete({ id: input.messageId, senderId: userId });
    return !!affected;
  }

  public async sendOrDeleteMessageReaction(
    userId: string,
    input: SendReactionInput,
  ): Promise<MessageReactionsEntity | boolean> {
    await this.messagesRepository.findOneOrFail({ where: { id: input.messageId } });

    const hasReacted = await this.messageReactionsRepository.findOne({
      where: { messageId: input.messageId, userId: userId },
    });
    if (hasReacted)
      return !!(await this.messageReactionsRepository.delete({ messageId: input.messageId, userId: userId })).affected;

    const reaction = this.messageReactionsRepository.create({
      messageId: input.messageId,
      reaction: input.reaction,
      userId: userId,
    });

    return await this.messageReactionsRepository.save(reaction);
  }

  public async sendReplyFromFan(fanId: string, input: SendMessageFromFanInput): Promise<MessagesEntity> {
    if (input.messageId) await this.messagesRepository.findOneOrFail({ where: { id: input.messageId } });

    await this.messageRepliesRepository.save({ messageId: input.messageId, replierId: fanId });

    return await this.sendMessageFromFan(fanId, input);
  }

  public async sendReplyFromCreator(creatorId: string, input: SendMessageFromCreatorInput): Promise<MessagesEntity> {
    if (input.messageId) await this.messagesRepository.findOneOrFail({ where: { id: input.messageId } });

    await this.messageRepliesRepository.save({ messageId: input.messageId, replierId: creatorId });

    return await this.sendMessageFromCreator(creatorId, input);
  }

  private async sendMessage(input: { channel: MessageChannelsEntity; params: SendMessageInput }) {
    const { channel, params } = input;
    const repliedTo = await this.messagesRepository.findOne({ where: { id: params.messageId } });

    const newMessage = this.messagesRepository.create({
      senderId: params.senderId,
      recipientUserId: params.recipientUserId,
      channel: channel,
      content: params.content,
      repliedTo: repliedTo ?? null,
      isExclusive: params.isExclusive ?? false,
      unlockPrice: params.unlockAmount ?? null,
    });

    if (params.assetIds) {
      newMessage.messageAssets = this.messageAssetsRepository.create(
        params.assetIds.map((assetId) => ({
          assetId: assetId,
        })),
      );
    }
    return await this.messagesRepository.save(newMessage);
  }
}
