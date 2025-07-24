import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, GqlAuthGuard } from '../auth';
import { MessageChannelsEntity } from '../rdb/entities';
import { PaginationInput, UserRoles } from '../util';
import { MessageChannelsService } from './message-channels.service';
import { CreateChannelInput, UpdateChannelInput, GetChannelsOutput, GetChannelOutput, GetChannelInput } from './dto';

@Resolver()
export class MessageChannelsResolver {
  public constructor(private messageChannelsService: MessageChannelsService) {}

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Mutation(() => MessageChannelsEntity)
  public async createChannel(@Args('input') input: CreateChannelInput): Promise<MessageChannelsEntity> {
    return await this.messageChannelsService.getOrCreateChannel(input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR])
  @Mutation(() => MessageChannelsEntity)
  public async updateChannel(
    @CurrentUser() creatorId: string,
    @Args('input') input: UpdateChannelInput,
  ): Promise<MessageChannelsEntity> {
    return this.messageChannelsService.updateChannel(creatorId, input);
  }

  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Query(() => [GetChannelsOutput])
  public async getChannels(
    @CurrentUser() userId: string,
    @Args('input') input: PaginationInput,
  ): Promise<GetChannelsOutput[]> {
    return await this.messageChannelsService.getChannels(userId, input);
  }
  //
  @Auth(GqlAuthGuard, [UserRoles.CREATOR, UserRoles.FAN])
  @Query(() => GetChannelOutput)
  public async getChannel(@CurrentUser() userId: string, @Args('input') input: GetChannelInput) {
    return await this.messageChannelsService.getChannel(userId, input);
  }
}
