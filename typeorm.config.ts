import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  namingStrategy: new SnakeNamingStrategy(),
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: false,
  entities: ['./src/rdb/entities/**/*.entity.ts'],
  uuidExtension: 'pgcrypto',
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
