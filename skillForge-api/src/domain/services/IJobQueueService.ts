export enum JobQueueName {
  MCQ_IMPORT = 'mcq-import',
  SUBSCRIPTION_EXPIRY = 'subscription-expiry',
  COMMUNITY_MEMBERSHIP_EXPIRY = 'community-membership-expiry',
}

export interface IJobQueueService {

  addJob<T extends Record<string, unknown>>(queueName: JobQueueName, data: T): Promise<void>;


  startWorker(): Promise<void>;
}