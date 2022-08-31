import { RedisOptions } from 'ioredis';

export default {
  limiter: {
    duration: 1000,
    max: 90,
  },
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASS,
    port: Number(process.env.REDIS_PORT),
  } as RedisOptions,
};
