import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as entities from './src/services/postgres/entities';
import * as migrations from './src/services/postgres/migrations';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.RAILWAY_DB_URL,
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
  entities,
  migrations,
  uuidExtension: 'pgcrypto',
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
