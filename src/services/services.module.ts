import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AdminModule } from './admin/admin.module';
import { AssetsModule } from './assets';
import { AuthModule } from './auth';
import { AwsS3Module } from './aws';
import { CreatorBlocksModule } from './creator-blocks/creator-blocks.module';
import { CreatorFollowsModule } from './creator-follows/creator-follows.module';
import { CreatorProfilesModule } from './creator-profiles';
import { CreatorRestrictsModule } from './creator-restricts/creator-restricts.module';
import { DocumentSelectorModule } from './document-selector/document-selector.module';
import { DownloaderModule } from './downloader/downloader.module';
import { ExtractorModule } from './extractor/extractor.module';
import { FanProfilesModule } from './fan-profiles';
import { ImportModule } from './import';
import { MessageChannelParticipantsModule } from './message-channel-participants';
import { MessageChannelsModule } from './message-channels';
import { MessagesModule } from './messages';
import { PostCommentsModule } from './post-comments';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './postgres/redis.module';
import { PostsModule } from './posts';
import { SessionsModule } from './sessions/sessions.module';
import { SocialAccountsModule } from './social-accounts/social-accounts.module';
import { UsersModule } from './users';
import { VaultsModule } from './vaults';

@Module({
  imports: [
    PostgresModule,
    RedisModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [],
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async () => ({
        autoSchemaFile: true,
        sortSchema: true,
        persistedQueries: false,
        plugins: [],
        playground: false,
        introspection: false,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.getOrThrow<string>('REDIS_URL'),
      }),
    }),
    AuthModule,
    UsersModule,
    AwsS3Module,
    FanProfilesModule,
    CreatorProfilesModule,
    PostsModule,
    AssetsModule,
    MessagesModule,
    PostCommentsModule,
    MessageChannelsModule,
    MessageChannelParticipantsModule,
    CreatorFollowsModule,
    CreatorBlocksModule,
    CreatorRestrictsModule,
    SocialAccountsModule,
    SessionsModule,
    ImportModule,
    VaultsModule,
    DownloaderModule,
    DocumentSelectorModule,
    ExtractorModule,
    AdminModule,
  ],
})
export class ServicesModule {}
