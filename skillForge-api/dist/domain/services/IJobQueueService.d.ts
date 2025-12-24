export declare enum JobQueueName {
    MCQ_IMPORT = "mcq_import",
    SUBSCRIPTION_EXPIRY = "subscription_expiry"
}
export interface IJobQueueService {
    addJob<T extends Record<string, unknown>>(queueName: JobQueueName, data: T): Promise<void>;
    startWorker(): Promise<void>;
}
//# sourceMappingURL=IJobQueueService.d.ts.map