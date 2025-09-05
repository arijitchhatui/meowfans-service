import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EntityMaker } from '../../lib/methods/from-raw-to-entity-type.method';
import * as repositories from './repositories';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: TypeOrmModuleOptions = {
          type: 'postgres',
          url: configService.get('SUPABASE_DB_URL'),
          logging: configService.get('NODE_ENV') === 'development',
          entities: [__dirname + '/../**/entities/**/*.entity.js'],
          migrations: [__dirname + '/../**/migrations/**/*[!index].js'],
          migrationsRun: !!configService.get('RUN_DB_MIGRATIONS_ON_START'),
          migrationsTableName: 'migrations',
          migrationsTransactionMode: 'each',
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
          uuidExtension: 'pgcrypto',
        };
        return options;
      },
    }),
  ],
  providers: [...Object.values(repositories), EntityMaker],
  exports: Object.values(repositories),
})
export class PostgresModule {}
