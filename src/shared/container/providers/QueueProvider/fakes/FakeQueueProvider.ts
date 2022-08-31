import { Job } from 'bull';

import IAddJobDTO from '../dtos/IAddJobDTO';
import IFindJobDTO from '../dtos/IFindJobDTO';
import IQueueProvider from '../models/IQueueProvider';

interface IQueue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  job?: any;
  [key: string]: string;
}

class BullQueueProvider implements IQueueProvider {
  private queues: IQueue = {};

  public async addJob({ jobData, key }: IAddJobDTO): Promise<void> {
    this.queues[key] = JSON.stringify(jobData);
  }

  public async findJob({ key }: IFindJobDTO): Promise<Job | undefined> {
    const data = this.queues[key];

    if (!data) {
      return undefined;
    }

    const parsedData = JSON.parse(data);

    return parsedData;
  }

  public async listActive(key: string): Promise<Job[]> {
    const data = this.queues[key];

    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data) as Job[];

    return parsedData;
  }

  public processQueue(): void {
    this.queues = {};
  }
}

export default BullQueueProvider;
