export declare enum JobQueueName {
    MCQ_IMPORT = "mcq_import"
}
export interface IJobQueueService {
    addJob<T extends Record<string, unknown>>(queueName: JobQueueName, data: T): Promise<void>;
    startWorker(): Promise<void>;
}
//# sourceMappingURL=JobQueueService.d.ts.map