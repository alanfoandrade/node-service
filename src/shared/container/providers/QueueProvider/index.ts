import { container } from 'tsyringe';

import BullQueueProvider from './implementations/BullQueueProvider';
import IQueueProvider from './models/IQueueProvider';

container.registerSingleton<IQueueProvider>('QueueProvider', BullQueueProvider);
