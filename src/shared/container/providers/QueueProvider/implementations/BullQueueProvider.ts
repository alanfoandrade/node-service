import queueConfig from '@config/queue';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import Queue, { Queue as BullClient, Job } from 'bull';
import { container } from 'tsyringe';

import IAddJobDTO from '../dtos/IAddJobDTO';
import IFindJobDTO from '../dtos/IFindJobDTO';
import IQueueProvider from '../models/IQueueProvider';

interface IQueue {
  [key: string]: {
    client: BullClient;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(job: any): Promise<void>;
  };
}

export default class BullQueueProvider implements IQueueProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private jobs: any[];

  private queues: IQueue;

  constructor() {
    this.queues = {};

    this.init();
  }

  public async addJob({ jobData, key, opts }: IAddJobDTO): Promise<void> {
    await this.queues[key].client.add(jobData, opts);
  }

  public async findJob({ jobId, key }: IFindJobDTO): Promise<Job | undefined> {
    const findJob = await this.queues[key].client.getJob(jobId);

    return findJob || undefined;
  }

  init(): void {
    const sendForgotPasswordEmailService = container.resolve(
      SendForgotPasswordEmailService,
    );

    this.jobs = [sendForgotPasswordEmailService];

    this.jobs.forEach(({ execute, key }) => {
      this.queues[key] = {
        client: new Queue(key, queueConfig),
        execute,
      };
    });
  }

  public async listActive(key: string): Promise<Job[]> {
    const activeJobs = await this.queues[key].client.getActive();

    return activeJobs;
  }

  public processQueue(): void {
    this.jobs.forEach((job) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.queues[job.key].client.process((queueJob: any) => {
        const { data } = queueJob;
        job.execute(data);
      });
    });
  }
}
