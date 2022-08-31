import { JobOptions } from 'bull';

export default interface IAddJobDTO {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jobData: any;
  key: string;
  opts?: JobOptions;
}
