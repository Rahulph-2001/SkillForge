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
exports.ListMCQImportJobsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
let ListMCQImportJobsUseCase = class ListMCQImportJobsUseCase {
    constructor(userRepository, jobRepository, storageService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.storageService = storageService;
    }
    async execute(templateId, adminId) {
        // 1. Authorization Check
        const admin = await this.userRepository.findById(adminId);
        if (!admin || admin.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // 2. Fetch Jobs
        const jobs = await this.jobRepository.findByTemplateId(templateId);
        // 3. Map to DTO, including generating error file URL
        const jobDTOs = jobs.map(job => {
            // NOTE: Assuming S3Service.getFileUrl() exists or we can just use the stored public URL
            const errorFileUrl = job.errorFilePath
                ? job.errorFilePath // We assume S3Service returns a complete public/signed URL
                : null;
            return {
                id: job.id,
                fileName: job.fileName,
                templateId: job.templateId,
                adminId: job.adminId,
                status: job.status,
                totalRows: job.totalRows,
                processedRows: job.processedRows,
                successfulRows: job.successfulRows,
                failedRows: job.failedRows,
                errorFileUrl,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt,
                startedAt: job.startedAt,
                completedAt: job.completedAt,
            };
        });
        return { jobs: jobDTOs };
    }
};
exports.ListMCQImportJobsUseCase = ListMCQImportJobsUseCase;
exports.ListMCQImportJobsUseCase = ListMCQImportJobsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IMCQImportJobRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListMCQImportJobsUseCase);
//# sourceMappingURL=ListMCQImportJobsUseCase.js.map