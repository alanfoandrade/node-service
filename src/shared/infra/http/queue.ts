import 'reflect-metadata';
import 'dotenv/config';

import '@shared/container';
import queueConfig from '@config/queue';

import BullQueueProvider from '@shared/container/providers/QueueProvider/implementations/BullQueueProvider';

import createDbConnection from '../typeorm';

async function runQueue() {
  await createDbConnection();

  const queue = new BullQueueProvider();

  queue.processQueue();

  // eslint-disable-next-line no-console
  console.log(`Queue started!`, queueConfig.redis.host);
}

runQueue();
