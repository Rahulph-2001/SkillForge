"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const XLSX = __importStar(require("xlsx"));
let StartMCQImportUseCase = class StartMCQImportUseCase {
    constructor(userRepository, templateRepository, storageService, jobRepository, jobQueueService) {
        this.userRepository = userRepository;
        this.templateRepository = templateRepository;
        this.storageService = storageService;
        this.jobRepository = jobRepository;
        this.jobQueueService = jobQueueService;
    }
    async execute(request, file) {
        const { templateId, adminId } = request;
        console.log('[StartMCQImportUseCase] Starting import process:', {
            templateId,
            adminId,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype
        });
        // 1. Authorization Check
        console.log('[StartMCQImportUseCase] Checking admin authorization');
        const admin = await this.userRepository.findById(adminId);
        if (!admin || admin.role !== UserRole_1.UserRole.ADMIN) {
            console.error('[StartMCQImportUseCase] Authorization failed:', { adminId, hasAdmin: !!admin, role: admin?.role });
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        console.log('[StartMCQImportUseCase] Admin authorized:', { adminId, adminName: admin.name });
        // 2. Template Existence Check
        console.log('[StartMCQImportUseCase] Checking template existence:', { templateId });
        const template = await this.templateRepository.findById(templateId);
        if (!template) {
            console.error('[StartMCQImportUseCase] Template not found:', { templateId });
            throw new AppError_1.NotFoundError('Skill template not found');
        }
        console.log('[StartMCQImportUseCase] Template found:', { templateId });
        // 3. File Type Validation
        console.log('[StartMCQImportUseCase] Validating file type:', { mimeType: file.mimetype, fileName: file.originalname });
        const allowedMimes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (!allowedMimes.includes(file.mimetype)) {
            console.error('[StartMCQImportUseCase] Invalid file type:', { mimeType: file.mimetype, allowedMimes });
            throw new AppError_1.ValidationError('Only CSV and Excel (.xlsx, .xls) files are supported');
        }
        console.log('[StartMCQImportUseCase] File type validation passed');
        // 4. Count Rows for Context (Pre-pass)
        console.log('[StartMCQImportUseCase] Counting rows in file');
        const rowCount = await this.countRows(file.buffer, file.originalname);
        console.log('[StartMCQImportUseCase] Row count:', { rowCount });
        if (rowCount === 0) {
            console.error('[StartMCQImportUseCase] File is empty');
            throw new AppError_1.ValidationError('The uploaded file is empty or contains no data');
        }
        // 5. Upload File to S3
        const key = `mcq-imports/${templateId}/${Date.now()}-${file.originalname}`;
        console.log('[StartMCQImportUseCase] Uploading file to S3:', { key, size: file.size });
        try {
            const filePath = await this.storageService.uploadFile(file.buffer, key, file.mimetype);
            console.log('[StartMCQImportUseCase] File uploaded successfully to S3:', { filePath });
            // 6. Create Pending Import Job Record
            console.log('[StartMCQImportUseCase] Creating job record in database');
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
            console.log('[StartMCQImportUseCase] Job record created:', { jobId: createdJob.id });
            // 7. Queue the Job
            console.log('[StartMCQImportUseCase] Adding job to queue:', { jobId: createdJob.id });
            await this.jobQueueService.addJob(IJobQueueService_1.JobQueueName.MCQ_IMPORT, {
                jobId: createdJob.id,
                filePath: createdJob.filePath,
                templateId: createdJob.templateId,
            });
            console.log('[StartMCQImportUseCase] Job queued successfully');
            return {
                jobId: createdJob.id,
                fileName: createdJob.fileName,
                status: 'PENDING',
                message: 'Import job initiated. Check status endpoint for progress.',
            };
        }
        catch (error) {
            console.error('[StartMCQImportUseCase] Error uploading file to S3:', {
                message: error.message,
                stack: error.stack,
                key
            });
            throw error;
        }
    }
    async countRows(buffer, fileName) {
        if (fileName.endsWith('xlsx') || fileName.endsWith('.xls')) {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1: A1');
            const count = range.e.r - range.s.r;
            return count > 0 ? count : 0;
        }
        else {
            return new Promise((resolve, reject) => {
                let count = 0;
                const stream = stream_1.Readable.from(buffer);
                stream
                    .pipe((0, csv_parser_1.default)())
                    .on('data', () => count++)
                    .on('end', () => resolve(count))
                    .on('error', (err) => reject(new AppError_1.ValidationError('Faailed to parse CSV file: ' + err.message)));
            });
        }
    }
};
exports.StartMCQImportUseCase = StartMCQImportUseCase;
exports.StartMCQImportUseCase = StartMCQImportUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillTemplateRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IMCQImportJobRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IJobQueueService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], StartMCQImportUseCase);
//# sourceMappingURL=StartMCQImportUseCase.js.map