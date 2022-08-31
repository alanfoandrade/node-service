import postgresConfig from '@config/postgres';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource(postgresConfig);

export default async function createDbConnection() {
  try {
    await dataSource.initialize();

    console.log(`Database connected!\n Host: ${process.env.PG_HOST}`);
  } catch (err) {
    console.log(err);
  }
}
