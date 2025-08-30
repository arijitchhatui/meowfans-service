import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AssetsModule } from './assets';
import { AuthModule } from './auth';
import { AwsS3Module } from './aws';
import { CreatorBlocksModule } from './creator-blocks/creator-blocks.module';
import { CreatorFollowsModule } from './creator-follows/creator-follows.module';
import { CreatorProfilesModule } from './creator-profiles';
import { CreatorRestrictsModule } from './creator-restricts/creator-restricts.module';
import { FanProfilesModule } from './fan-profiles';
import { MessageChannelParticipantsModule } from './message-channel-participants';
import { MessageChannelsModule } from './message-channels';
import { MessagesModule } from './messages';
import { PostCommentsModule } from './post-comments';
import { PostgresModule } from './postgres/postgres.module';
import { PostsModule } from './posts';
import { SessionsModule } from './sessions/sessions.module';
import { SocialAccountsModule } from './social-accounts/social-accounts.module';
import { UsersModule } from './users';

@Module({
  imports: [
    PostgresModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [],
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        sortSchema: true,
        persistedQueries: false,
        plugins: configService.get('ENABLE_DEV_TOOLS', false) ? [ApolloServerPluginLandingPageLocalDefault()] : [],
        playground: false,
        introspection: configService.get('ENABLE_DEV_TOOLS', false),
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
  ],
  controllers: [],
  providers: [],
})
export class ServicesModule {}
