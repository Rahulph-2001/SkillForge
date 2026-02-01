export declare enum JobQueueName {
    MCQ_IMPORT = "mcq-import",
    SUBSCRIPTION_EXPIRY = "subscription-expiry",
    COMMUNITY_MEMBERSHIP_EXPIRY = "community-membership-expiry",
    COMMUNITY_AUTO_RENEW = "community-auto-renew"
}
export interface IJobQueueService {
    addJob<T extends Record<string, unknown>>(queueName: JobQueueName, data: T): Promise<void>;
    startWorker(): Promise<void>;
}
//# sourceMappingURL=IJobQueueService.d.ts.map