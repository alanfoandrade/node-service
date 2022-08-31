import { JobId } from 'bull';

export default interface IFindJobDTO {
  jobId: JobId;
  key: string;
}
