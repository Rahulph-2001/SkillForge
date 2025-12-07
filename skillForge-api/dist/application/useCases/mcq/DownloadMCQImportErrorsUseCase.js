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
exports.DownloadMCQImportErrorsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
let DownloadMCQImportErrorsUseCase = class DownloadMCQImportErrorsUseCase {
    constructor(jobRepository, s3Service, userRepository) {
        this.jobRepository = jobRepository;
        this.s3Service = s3Service;
        this.userRepository = userRepository;
    }
    async execute(jobId, adminId) {
        // 1. Authorization
        const admin = await this.userRepository.findById(adminId);
        if (!admin || admin.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // 2. Job Existence
        const job = await this.jobRepository.findById(jobId);
        if (!job) {
            throw new AppError_1.NotFoundError('Import job not found');
        }
        // 3. Check for Error File
        if (!job.errorFilePath) {
            throw new AppError_1.NotFoundError('No error file available for this job');
        }
        // 4. Get File Stream from S3
        const fileStream = await this.s3Service.downloadFileAsStream(job.errorFilePath);
        const fileName = `import-errors-${job.id}.csv`;
        return {
            fileStream,
            fileName,
            mimeType: 'text/csv',
        };
    }
};
exports.DownloadMCQImportErrorsUseCase = DownloadMCQImportErrorsUseCase;
exports.DownloadMCQImportErrorsUseCase = DownloadMCQImportErrorsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IMCQImportJobRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IS3Service)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], DownloadMCQImportErrorsUseCase);
//# sourceMappingURL=DownloadMCQImportErrorsUseCase.js.map