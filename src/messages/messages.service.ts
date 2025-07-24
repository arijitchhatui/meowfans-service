import { Injectable } from '@nestjs/common';
import { shake } from 'radash';
import { MessageChannelsService } from '../message-channels';
import { MessageChannelsEntity } from '../rdb/entities';
import {
  MessageAssetsRepository,
  MessageReactionsRepository,
  MessageRepliesRepository,
  MessagesRepository,
} from '../rdb/repositories';
import { PaginationInput } from '../util';
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
    private messageReactionsRepository: MessageReactionsRepository,
    private messageRepliesRepository: MessageRepliesRepository,
    private messageAssetsRepository: MessageAssetsRepository,
    private messageChannelsService: MessageChannelsService,
    private messagesRepository: MessagesRepository,
  ) {}

  public async getChannelMessages(userId: string, input: PaginationInput) {
    return await this.messagesRepository.getChannelMessages(userId, input);
  }

  public async sendMessageFromCreator(creatorId: string, input: SendMessageFromCreatorInput) {
    const channel = await this.messageChannelsService.getOrCreateChannel({ creatorId, fanId: input.recipientUserId });

    const newMessage = await this.sendMessage({ channel, params: input });

    return await this.messagesRepository.save(newMessage);
  }

  public async sendMessageFromFan(fanId: string, input: SendMessageFromFanInput) {
    const channel = await this.messageChannelsService.getOrCreateChannel({ fanId, creatorId: input.recipientUserId });

    const newMessage = await this.sendMessage({ channel, params: input });

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

  public async sendReplyFromFan(fanId: string, input: SendMessageFromFanInput) {
    if (input.messageId) await this.messagesRepository.findOneOrFail({ where: { id: input.messageId } });

    await this.messageRepliesRepository.save({ messageId: input.messageId, replierId: fanId });

    return await this.sendMessageFromFan(fanId, input);
  }

  public async sendReplyFromCreator(creatorId: string, input: SendMessageFromCreatorInput) {
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
          creatorAssetId: assetId,
        })),
      );
    }
    return await this.messagesRepository.save(newMessage);
  }
}
