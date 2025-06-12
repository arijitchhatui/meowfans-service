import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getEnv } from './src/util/constants';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: getEnv('POSTGRES_HOST'),
  port: Number(getEnv('POSTGRES_PORT')),
  username: getEnv('POSTGRES_USERNAME'),
  namingStrategy: new SnakeNamingStrategy(),
  password: getEnv('POSTGRES_PASSWORD'),
  database: getEnv('POSTGRES_DB'),
  logging: false,
  entities: ['./src/rdb/entities/**/*.entity.ts'],
  uuidExtension: 'pgcrypto',
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
