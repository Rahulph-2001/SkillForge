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
exports.MCQImportJobRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const MCQImportJob_1 = require("../../../domain/entities/MCQImportJob");
const AppError_1 = require("../../../domain/errors/AppError");
const BaseRepository_1 = require("../BaseRepository");
let MCQImportJobRepository = class MCQImportJobRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'mcqImportJob');
    }
    toDomain(orm) {
        return new MCQImportJob_1.MCQImportJob({
            id: orm.id,
            templateId: orm.templateId,
            adminId: orm.adminId,
            fileName: orm.fileName,
            filePath: orm.filePath,
            status: orm.status,
            totalRows: orm.totalRows,
            processedRows: orm.processedRows,
            successfulRows: orm.successfulRows,
            failedRows: orm.failedRows,
            errorFilePath: orm.errorFilePath,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
            startedAt: orm.startedAt,
            completedAt: orm.completedAt,
        });
    }
    toPersistence(domain) {
        return {
            id: domain.id,
            templateId: domain.templateId,
            adminId: domain.adminId,
            fileName: domain.fileName,
            filePath: domain.filePath,
            status: domain.status,
            totalRows: domain.totalRows,
            processedRows: domain.processedRows,
            successfulRows: domain.successfulRows,
            failedRows: domain.failedRows,
            errorFilePath: domain.errorFilePath,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
            startedAt: domain.startedAt,
            completedAt: domain.completedAt,
        };
    }
    async create(job) {
        const created = await this.prisma.mcqImportJob.create({
            data: this.toPersistence(job),
        });
        return this.toDomain(created);
    }
    async findById(id) {
        const job = await this.prisma.mcqImportJob.findUnique({
            where: { id },
        });
        return job ? this.toDomain(job) : null;
    }
    async findByTemplateId(templateId) {
        const jobs = await this.prisma.mcqImportJob.findMany({
            where: { templateId },
            orderBy: { createdAt: 'desc' },
        });
        return jobs.map(this.toDomain);
    }
    async update(job) {
        try {
            const updated = await this.prisma.mcqImportJob.update({
                where: { id: job.id },
                data: this.toPersistence(job),
            });
            return this.toDomain(updated);
        }
        catch (error) {
            throw new AppError_1.NotFoundError('MCQ Import Job not found for update');
        }
    }
    async updateProgress(jobId, status, processedRows, successfulRows, failedRows, errorFilePath, startedAt, completedAt) {
        const updateData = {
            status,
            processedRows,
            successfulRows,
            failedRows,
            errorFilePath,
            updatedAt: new Date(),
        };
        if (startedAt)
            updateData.startedAt = startedAt;
        if (completedAt)
            updateData.completedAt = completedAt;
        try {
            const updated = await this.prisma.mcqImportJob.update({
                where: { id: jobId },
                data: updateData,
            });
            return this.toDomain(updated);
        }
        catch (error) {
            throw new AppError_1.NotFoundError('MCQ Import Job not found for progress update');
        }
    }
};
exports.MCQImportJobRepository = MCQImportJobRepository;
exports.MCQImportJobRepository = MCQImportJobRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], MCQImportJobRepository);
//# sourceMappingURL=MCQImportJobRepository.js.map