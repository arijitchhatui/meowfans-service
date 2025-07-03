import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getConfigService } from './src/util/constants';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: getConfigService('POSTGRES_HOST'),
  port: Number(getConfigService('POSTGRES_PORT')),
  username: getConfigService('POSTGRES_USERNAME'),
  namingStrategy: new SnakeNamingStrategy(),
  password: getConfigService('POSTGRES_PASSWORD'),
  database: getConfigService('POSTGRES_DB'),
  logging: false,
  entities: ['./src/rdb/entities/**/*.entity.ts'],
  migrations: ['./src/rdb/migrations/**/*.ts'],
  uuidExtension: 'pgcrypto',
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
