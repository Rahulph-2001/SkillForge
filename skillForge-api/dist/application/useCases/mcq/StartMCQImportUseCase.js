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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartMCQImportUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const IJobQueueService_1 = require("../../../domain/services/IJobQueueService");
const AppError_1 = require("../../../domain/errors/AppError");
const MCQImportJob_1 = require("../../../domain/entities/MCQImportJob");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
let StartMCQImportUseCase = class StartMCQImportUseCase {
    constructor(userRepository, templateRepository, s3Service, jobRepository, jobQueueService) {
        this.userRepository = userRepository;
        this.templateRepository = templateRepository;
        this.s3Service = s3Service;
        this.jobRepository = jobRepository;
        this.jobQueueService = jobQueueService;
    }
    async execute(request, file) {
        const { templateId, adminId } = request;
        // 1. Authorization Check
        const admin = await this.userRepository.findById(adminId);
        if (!admin || admin.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // 2. Template Existence Check
        const template = await this.templateRepository.findById(templateId);
        if (!template) {
            throw new AppError_1.NotFoundError('Skill template not found');
        }
        // 3. Basic File Validation (Content/Format)
        if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
            throw new AppError_1.ValidationError('Only CSV files are supported for bulk import');
        }
        // 4. Count Rows for Context (Pre-pass)
        const rowCount = await this.countRows(file.buffer);
        if (rowCount === 0) {
            throw new AppError_1.ValidationError('The uploaded CSV file is empty');
        }
        // 5. Upload File to S3
        const key = `mcq-imports/${templateId}/${Date.now()}-${file.originalname}`;
        const filePath = await this.s3Service.uploadFile(file.buffer, key, file.mimetype);
        // 6. Create Pending Import Job Record
        const job = new MCQImportJob_1.MCQImportJob({
            templateId,
            adminId,
            fileName: file.originalname,
            filePath,
            status: MCQImportJob_1.ImportStatus.PENDING,
            totalRows: rowCount,
            processedRows: 0,
            successfulRows: 0,
            failedRows: 0,
            errorFilePath: null,
        });
        const createdJob = await this.jobRepository.create(job);
        // 7. Queue the Job
        await this.jobQueueService.addJob(IJobQueueService_1.JobQueueName.MCQ_IMPORT, {
            jobId: createdJob.id,
            filePath: createdJob.filePath,
            templateId: createdJob.templateId,
        });
        return {
            jobId: createdJob.id,
            fileName: createdJob.fileName,
            status: 'PENDING',
            message: 'Import job initiated. Check status endpoint for progress.',
        };
    }
    async countRows(buffer) {
        return new Promise((resolve, reject) => {
            let count = 0;
            const stream = stream_1.Readable.from(buffer);
            stream
                .pipe((0, csv_parser_1.default)())
                .on('data', () => count++)
                .on('end', () => resolve(count))
                .on('error', (err) => reject(new AppError_1.ValidationError('Failed to parse CSV file: ' + err.message)));
        });
    }
};
exports.StartMCQImportUseCase = StartMCQImportUseCase;
exports.StartMCQImportUseCase = StartMCQImportUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillTemplateRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IS3Service)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IMCQImportJobRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IJobQueueService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], StartMCQImportUseCase);
//# sourceMappingURL=StartMCQImportUseCase.js.map