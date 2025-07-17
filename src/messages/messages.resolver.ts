import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard, UserRoles } from 'src/auth';
import { MessageChannelsEntity, MessageReactionsEntity, MessagesEntity } from 'src/rdb/entities';
import {
  CreateChannelInput,
  DeleteMessageInput,
  DeleteMessagesInput,
  GetChannelInput,
  GetChannelOutput,
  GetChannelsOutput,
  GetMessagesInput,
  SendReactionInput,
  SendReplyToCreatorInput,
  SendReplyToFanInput,
  SendToCreatorMessageInput,
  SendToFanMessageInput,
  UpdateChannelInput,
  UpdateMessageInput,
} from './dto';
import { MessagesService } from './messages.service';

@Resolver()
export class MessagesResolver {
  public constructor(private messagesService: MessagesService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => MessageChannelsEntity)
  public async createChannel(@Args('input') input: CreateChannelInput): Promise<MessageChannelsEntity> {
    return await this.messagesService.createChannel(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => MessageChannelsEntity)
  public async updateChannel(
    @CurrentUser() creatorId: string,
    @Args('input') input: UpdateChannelInput,
  ): Promise<MessageChannelsEntity> {
    return this.messagesService.updateChannel(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Query(() => [GetChannelsOutput])
  public async getChannels(@CurrentUser() userId: string): Promise<GetChannelsOutput[]> {
    return await this.messagesService.getChannels(userId);
  }
  //
  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Query(() => GetChannelOutput)
  public async getChannel(@CurrentUser() userId: string, @Args('input') input: GetChannelInput) {
    return await this.messagesService.getChannel(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Query(() => [MessagesEntity])
  public async getChannelMessages(
    @CurrentUser() fanId: string,
    @Args('input') input: GetMessagesInput,
  ): Promise<MessagesEntity[]> {
    return await this.messagesService.getChannelMessages(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => MessagesEntity)
  public async sendMessageToFan(
    @CurrentUser() creatorId: string,
    @Args('input') input: SendToFanMessageInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendMessageToFan(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => MessagesEntity)
  public async sendMessageToCreator(
    @CurrentUser() fanId: string,
    @Args('input') input: SendToCreatorMessageInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendMessageToCreator(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => MessagesEntity)
  public async updateMessage(
    @CurrentUser() userId: string,
    @Args('input') input: UpdateMessageInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.updateMessage(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => Boolean)
  public async deleteMessage(
    @CurrentUser() userId: string,
    @Args('input') input: DeleteMessageInput,
  ): Promise<boolean> {
    return await this.messagesService.deleteMessage(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => Boolean)
  public async deleteMessages(
    @CurrentUser() userId: string,
    @Args('input') input: DeleteMessagesInput,
  ): Promise<boolean> {
    return await this.messagesService.deleteMessages(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.CREATOR])
  @Mutation(() => MessageReactionsEntity)
  public async sendOrDeleteMessageReaction(
    @CurrentUser() userId: string,
    @Args('input') input: SendReactionInput,
  ): Promise<MessageReactionsEntity> {
    return await this.messagesService.sendOrDeleteMessageReaction(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => MessagesEntity)
  public async sendReplyToCreator(
    @CurrentUser() fanId: string,
    @Args('input') input: SendReplyToCreatorInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendReplyToCreator(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => MessagesEntity)
  public async sendReplyToFan(
    @CurrentUser() creatorId: string,
    @Args('input') input: SendReplyToFanInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendReplyToFan(creatorId, input);
  }
}
