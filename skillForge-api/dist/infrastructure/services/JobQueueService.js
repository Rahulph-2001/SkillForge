"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueueService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
const IJobQueueService_1 = require("../../domain/services/IJobQueueService");
const RedisService_1 = require("./RedisService");
const bullmq_1 = require("bullmq");
const MCQImportJobProcessor_1 = require("../../application/useCases/mcq/MCQImportJobProcessor");
let JobQueueService = class JobQueueService {
    constructor(redisService, mcqImportJobProcessor) {
        this.redisService = redisService;
        this.mcqImportJobProcessor = mcqImportJobProcessor;
        this.queues = new Map();
        this.workers = new Map();
        this.initializeQueues();
    }
    initializeQueues() {
        const connectionOptions = this.redisService.getRedisOptions().connection;
        // Initialize MCQ Import Queue
        const mcqQueue = new bullmq_1.Queue(IJobQueueService_1.JobQueueName.MCQ_IMPORT, { connection: connectionOptions });
        this.queues.set(IJobQueueService_1.JobQueueName.MCQ_IMPORT, mcqQueue);
    }
    async addJob(queueName, data) {
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
    async startWorker() {
        const connectionOptions = this.redisService.getRedisOptions().connection;
        // Start MCQ Import Worker
        if (!this.workers.has(IJobQueueService_1.JobQueueName.MCQ_IMPORT)) {
            const worker = new bullmq_1.Worker(IJobQueueService_1.JobQueueName.MCQ_IMPORT, async (job) => {
                console.log(`[Worker] Processing job ${job.id} from ${IJobQueueService_1.JobQueueName.MCQ_IMPORT}`);
                try {
                    await this.mcqImportJobProcessor.execute(job.data.jobId);
                    console.log(`[Worker] Job ${job.id} completed`);
                }
                catch (error) {
                    console.error(`[Worker] Job ${job.id} failed:`, error);
                    throw error;
                }
            }, { connection: connectionOptions });
            worker.on('completed', (job) => {
                console.log(`[Worker] Job ${job.id} has completed!`);
            });
            worker.on('failed', (job, err) => {
                console.log(`[Worker] Job ${job?.id} has failed with ${err.message}`);
            });
            this.workers.set(IJobQueueService_1.JobQueueName.MCQ_IMPORT, worker);
            console.log(`[JobQueueService] Worker for ${IJobQueueService_1.JobQueueName.MCQ_IMPORT} started`);
        }
    }
};
exports.JobQueueService = JobQueueService;
exports.JobQueueService = JobQueueService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RedisService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.MCQImportJobProcessor)),
    __metadata("design:paramtypes", [RedisService_1.RedisService,
        MCQImportJobProcessor_1.MCQImportJobProcessor])
], JobQueueService);
//# sourceMappingURL=JobQueueService.js.map