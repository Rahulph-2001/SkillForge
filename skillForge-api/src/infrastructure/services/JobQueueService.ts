import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { IJobQueueService, JobQueueName } from '../../domain/services/IJobQueueService';
import { RedisService } from './RedisService';
import { Queue, Worker, Job } from 'bullmq';
import { MCQImportJobProcessor } from '../../application/useCases/mcq/MCQImportJobProcessor';
import { ICheckSubscriptionExpiryUseCase } from '../../application/useCases/subscription/CheckSubscriptionExpiryUseCase';

@injectable()
export class JobQueueService implements IJobQueueService {
  private queues: Map<JobQueueName, Queue> = new Map();
  private workers: Map<JobQueueName, Worker> = new Map();

  constructor(
    @inject(TYPES.RedisService) private redisService: RedisService,
    @inject(TYPES.MCQImportJobProcessor) private mcqImportJobProcessor: MCQImportJobProcessor,
    @inject(TYPES.ICheckSubscriptionExpiryUseCase) private checkSubscriptionExpiryUseCase: ICheckSubscriptionExpiryUseCase
  ) {
    this.initializeQueues();
  }

  private initializeQueues() {
    const connectionOptions = this.redisService.getRedisOptions().connection;

    // Initialize MCQ Import Queue
    const mcqQueue = new Queue(JobQueueName.MCQ_IMPORT, { connection: connectionOptions });
    this.queues.set(JobQueueName.MCQ_IMPORT, mcqQueue);

    // Initialize Subscription Expiry Queue
    const expiryQueue = new Queue(JobQueueName.SUBSCRIPTION_EXPIRY, { connection: connectionOptions });
    this.queues.set(JobQueueName.SUBSCRIPTION_EXPIRY, expiryQueue);

    // Schedule the daily check
    expiryQueue.add(JobQueueName.SUBSCRIPTION_EXPIRY, {}, {
      repeat: {
        pattern: '0 0 * * *', // Daily at midnight
      },
      removeOnComplete: true,
    });
  }

  async addJob<T extends Record<string, unknown>>(queueName: JobQueueName, data: T): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not initialized`);
    }

    await queue.add(queueName, data, {
      removeOnComplete: true,
      removeOnFail: false, // Keep failed jobs for inspection
    });

    console.log(`[JobQueueService] Added job to ${queueName}`);
  }

  async startWorker(): Promise<void> {
    const connectionOptions = this.redisService.getRedisOptions().connection;

    // Start MCQ Import Worker
    if (!this.workers.has(JobQueueName.MCQ_IMPORT)) {
      const worker = new Worker(
        JobQueueName.MCQ_IMPORT,
        async (job: Job) => {
          console.log(`[Worker] Processing job ${job.id} from ${JobQueueName.MCQ_IMPORT}`);
          try {
            await this.mcqImportJobProcessor.execute(job.data.jobId);
            console.log(`[Worker] Job ${job.id} completed`);
          } catch (error) {
            console.error(`[Worker] Job ${job.id} failed:`, error);
            throw error;
          }
        },
        { connection: connectionOptions }
      );

      this.setupWorkerListeners(worker, JobQueueName.MCQ_IMPORT);
      this.workers.set(JobQueueName.MCQ_IMPORT, worker);
    }

    // Start Subscription Expiry Worker
    if (!this.workers.has(JobQueueName.SUBSCRIPTION_EXPIRY)) {
      const worker = new Worker(
        JobQueueName.SUBSCRIPTION_EXPIRY,
        async (job: Job) => {
          console.log(`[Worker] Processing job ${job.id} from ${JobQueueName.SUBSCRIPTION_EXPIRY}`);
          try {
            await this.checkSubscriptionExpiryUseCase.execute();
            console.log(`[Worker] Job ${job.id} completed`);
          } catch (error) {
            console.error(`[Worker] Job ${job.id} failed:`, error);
            throw error;
          }
        },
        { connection: connectionOptions }
      );

      this.setupWorkerListeners(worker, JobQueueName.SUBSCRIPTION_EXPIRY);
      this.workers.set(JobQueueName.SUBSCRIPTION_EXPIRY, worker);
    }
  }

  private setupWorkerListeners(worker: Worker, queueName: string) {
    worker.on('completed', (job) => {
      console.log(`[Worker] Job ${job.id} in ${queueName} has completed!`);
    });

    worker.on('failed', (job, err) => {
      console.log(`[Worker] Job ${job?.id} in ${queueName} has failed with ${err.message}`);
    });

    console.log(`[JobQueueService] Worker for ${queueName} started`);
  }
}