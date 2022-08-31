import { DataSourceOptions } from 'typeorm';

const postgresConfig: DataSourceOptions = {
  database: process.env.PG_DB,
  entities: [
    process.env.NODE_ENV === 'prod'
      ? './dist/modules/**/infra/typeorm/entities/*.js'
      : './src/modules/**/infra/typeorm/entities/*.ts',
  ],
  host: process.env.PG_HOST,
  migrations: [
    process.env.NODE_ENV === 'prod'
      ? './dist/shared/infra/typeorm/migrations/*.js'
      : './src/shared/infra/typeorm/migrations/*.ts',
  ],
  password: process.env.PG_PASS,
  port: Number(process.env.PG_PORT),
  type: 'postgres',
  username: process.env.PG_USER,
};

export default postgresConfig;
