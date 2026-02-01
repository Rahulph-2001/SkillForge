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
exports.MCQImportController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const AppError_1 = require("../../../domain/errors/AppError");
let MCQImportController = class MCQImportController {
    constructor(startImportUseCase, listJobsUseCase, downloadErrorsUseCase, responseBuilder) {
        this.startImportUseCase = startImportUseCase;
        this.listJobsUseCase = listJobsUseCase;
        this.downloadErrorsUseCase = downloadErrorsUseCase;
        this.responseBuilder = responseBuilder;
        /**
         * POST /api/v1/admin/mcq/import/:templateId
         * Starts the bulk import process via a worker queue
         */
        this.startImport = async (req, res, next) => {
            try {
                console.log('[MCQImportController] Starting MCQ import process');
                const adminId = req.user.userId;
                const { templateId } = req.params;
                const file = req.file;
                console.log('[MCQImportController] Request details:', {
                    adminId,
                    templateId,
                    hasFile: !!file,
                    fileName: file?.originalname,
                    fileSize: file?.size,
                    mimeType: file?.mimetype
                });
                if (!file) {
                    console.error('[MCQImportController] No file uploaded');
                    throw new AppError_1.ValidationError('CSV or Excel file is required for import');
                }
                console.log('[MCQImportController] File validation passed, executing use case');
                const result = await this.startImportUseCase.execute({
                    templateId,
                    adminId,
                    fileName: file.originalname,
                    filePath: '' // Will be set by the use case after upload
                }, file);
                console.log('[MCQImportController] Import job created successfully:', {
                    jobId: result.jobId,
                    fileName: result.fileName,
                    status: result.status
                });
                const response = this.responseBuilder.success(result, result.message, HttpStatusCode_1.HttpStatusCode.ACCEPTED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                console.error('[MCQImportController] Error during import:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
                next(error);
            }
        };
        /**
         * GET /api/v1/admin/mcq/import/:templateId/status
         * Lists all import jobs for a specific template
         */
        this.listJobs = async (req, res, next) => {
            try {
                const adminId = req.user.userId;
                const { templateId } = req.params;
                const result = await this.listJobsUseCase.execute(templateId, adminId);
                const response = this.responseBuilder.success(result, `Found ${result.jobs.length} import jobs for template ${templateId}`, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * GET /api/v1/admin/mcq/import/errors/:jobId/download
         * Downloads the CSV error file for a failed job
         */
        this.downloadErrors = async (req, res, next) => {
            try {
                const adminId = req.user.userId;
                const { jobId } = req.params;
                const { fileStream, fileName, mimeType } = await this.downloadErrorsUseCase.execute(jobId, adminId);
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                fileStream.pipe(res);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.MCQImportController = MCQImportController;
exports.MCQImportController = MCQImportController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IStartMCQImportUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IListMCQImportJobsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IDownloadMCQImportErrorsUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], MCQImportController);
//# sourceMappingURL=MCQImportController.js.map