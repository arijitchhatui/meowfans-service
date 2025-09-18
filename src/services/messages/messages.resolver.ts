import { PaginationInput } from '@app/helpers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { MessageReactionsEntity, MessagesEntity } from '../postgres/entities';
import {
  DeleteMessageInput,
  DeleteMessagesInput,
  SendMessageFromCreatorInput,
  SendMessageFromFanInput,
  SendReactionInput,
  UpdateMessageInput,
} from './dto';
import { MessagesService } from './messages.service';
import { UserRoles } from '../../util/enums';

@Resolver()
export class MessagesResolver {
  public constructor(private messagesService: MessagesService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Query(() => [MessagesEntity])
  public async getChannelMessages(
    @CurrentUser() fanId: string,
    @Args('input') input: PaginationInput,
  ): Promise<MessagesEntity[]> {
    return await this.messagesService.getChannelMessages(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => MessagesEntity)
  public async sendMessageFromCreator(
    @CurrentUser() creatorId: string,
    @Args('input') input: SendMessageFromCreatorInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendMessageFromCreator(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => MessagesEntity)
  public async sendMessageFromFan(
    @CurrentUser() fanId: string,
    @Args('input') input: SendMessageFromFanInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendMessageFromFan(fanId, input);
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
  ): Promise<MessageReactionsEntity | boolean> {
    return await this.messagesService.sendOrDeleteMessageReaction(userId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.FAN])
  @Mutation(() => MessagesEntity)
  public async sendReplyFromFan(
    @CurrentUser() fanId: string,
    @Args('input') input: SendMessageFromFanInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendReplyFromFan(fanId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => MessagesEntity)
  public async sendReplyFromCreator(
    @CurrentUser() creatorId: string,
    @Args('input') input: SendMessageFromCreatorInput,
  ): Promise<MessagesEntity> {
    return await this.messagesService.sendReplyFromCreator(creatorId, input);
  }
}
