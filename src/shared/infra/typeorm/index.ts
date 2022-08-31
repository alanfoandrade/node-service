import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

import postgresConfig from '../../../config/postgres';

const dbConnection = new DataSource(postgresConfig);

dbConnection
  .initialize()
  .then(() => console.log(`Database connected!\n Host: ${process.env.PG_HOST}`))
  .catch((err) => console.log(err));

export default dbConnection;
