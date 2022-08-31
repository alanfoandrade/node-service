import { Job } from 'bull';

import IAddJobDTO from '../dtos/IAddJobDTO';
import IFindJobDTO from '../dtos/IFindJobDTO';

export default interface IQueueProvider {
  addJob(data: IAddJobDTO): Promise<void>;
  findJob(data: IFindJobDTO): Promise<Job | undefined>;
  listActive(key: string): Promise<Job[]>;
  processQueue(): void;
}
