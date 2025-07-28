import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AssetsModule } from './assets';
import { AuthModule } from './auth';
import { CreatorProfilesModule } from './creator-profiles';
import { FanProfilesModule } from './fan-profiles';
import { MessageChannelParticipantsModule } from './message-channel-participants';
import { MessageChannelsModule } from './message-channels';
import { MessagesModule } from './messages';
import { PostCommentsModule } from './post-comments';
import { PostsModule } from './posts';
import { RdbModule } from './rdb/rdb.module';
import { UploadsModule } from './uploads';
import { UsersModule } from './users';

@Module({
  imports: [
    RdbModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        sortSchema: true,
        persistedQueries: false,
        plugins: configService.get('ENABLE_DEV_TOOLS', false) ? [ApolloServerPluginLandingPageLocalDefault()] : [],
        playground: false,
        introspection: configService.get('ENABLE_DEV_TOOLS', false),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    UploadsModule,
    FanProfilesModule,
    CreatorProfilesModule,
    PostsModule,
    AssetsModule,
    MessagesModule,
    PostCommentsModule,
    MessageChannelsModule,
    MessageChannelParticipantsModule,
  ],
  controllers: [],
  providers: [],
})
export class ServicesModule {}
