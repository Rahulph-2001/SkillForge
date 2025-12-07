import { IJobQueueService, JobQueueName } from '../../domain/services/IJobQueueService';
import { RedisService } from './RedisService';
import { MCQImportJobProcessor } from '../../application/useCases/mcq/MCQImportJobProcessor';
export declare class JobQueueService implements IJobQueueService {
    private redisService;
    private mcqImportJobProcessor;
    private queues;
    private workers;
    constructor(redisService: RedisService, mcqImportJobProcessor: MCQImportJobProcessor);
    private initializeQueues;
    addJob<T extends Record<string, unknown>>(queueName: JobQueueName, data: T): Promise<void>;
    startWorker(): Promise<void>;
}
//# sourceMappingURL=JobQueueService.d.ts.map