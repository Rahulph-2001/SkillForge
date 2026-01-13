import { IJobQueueService, JobQueueName } from '../../domain/services/IJobQueueService';
import { RedisService } from './RedisService';
import { MCQImportJobProcessor } from '../../application/useCases/mcq/MCQImportJobProcessor';
import { ICheckSubscriptionExpiryUseCase } from '../../application/useCases/subscription/interfaces/ICheckSubscriptionExpiryUseCase';
export declare class JobQueueService implements IJobQueueService {
    private redisService;
    private mcqImportJobProcessor;
    private checkSubscriptionExpiryUseCase;
    private queues;
    private workers;
    constructor(redisService: RedisService, mcqImportJobProcessor: MCQImportJobProcessor, checkSubscriptionExpiryUseCase: ICheckSubscriptionExpiryUseCase);
    private initializeQueues;
    addJob<T extends Record<string, unknown>>(queueName: JobQueueName, data: T): Promise<void>;
    startWorker(): Promise<void>;
    private setupWorkerListeners;
}
//# sourceMappingURL=JobQueueService.d.ts.map