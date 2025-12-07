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
exports.MCQImportJobProcessor = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const MCQImportJob_1 = require("../../../domain/entities/MCQImportJob");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const TemplateQuestion_1 = require("../../../domain/entities/TemplateQuestion");
const uuid_1 = require("uuid");
const AppError_1 = require("../../../domain/errors/AppError");
let MCQImportJobProcessor = class MCQImportJobProcessor {
    constructor(jobRepository, questionRepository, s3Service) {
        this.jobRepository = jobRepository;
        this.questionRepository = questionRepository;
        this.s3Service = s3Service;
        this.validLevels = ['Beginner', 'Intermediate', 'Advanced'];
        this.validAnswers = ['A', 'B', 'C', 'D'];
    }
    async execute(jobId) {
        const job = await this.jobRepository.findById(jobId);
        if (!job) {
            console.error(`[MCQProcessor] Job ${jobId} not found.`);
            return;
        }
        job.startProcessing(job.totalRows);
        await this.jobRepository.update(job);
        let processedRows = 0;
        let successfulRows = 0;
        let failedRows = 0;
        const errors = [];
        let errorFilePath = null;
        let totalRowsCount = 0;
        try {
            // 1. Download file from S3
            const fileBuffer = await this.s3Service.downloadFile(job.filePath);
            const stream = stream_1.Readable.from(fileBuffer);
            const parser = stream.pipe((0, csv_parser_1.default)());
            // 2. Process rows iteratively
            for await (const row of parser) {
                totalRowsCount++;
                const rowNumber = totalRowsCount;
                processedRows++;
                try {
                    // A. Map and Validate row
                    const questionData = this.validateAndMapRow(row, job.templateId);
                    // B. Create Domain Entity and save
                    const question = TemplateQuestion_1.TemplateQuestion.create((0, uuid_1.v4)(), questionData.templateId, questionData.level, questionData.question, questionData.options, questionData.correctAnswerIndex, questionData.explanation, true, new Date(), new Date());
                    await this.questionRepository.create(question);
                    successfulRows++;
                }
                catch (e) {
                    failedRows++;
                    errors.push({
                        row: rowNumber,
                        reason: e instanceof AppError_1.AppError ? e.message : e.message || 'Unknown validation error',
                        data: row
                    });
                }
                // C. Update progress every N rows (e.g., every 50 rows or if it's the last row)
                if (processedRows % 50 === 0 || processedRows === job.totalRows) {
                    await this.jobRepository.updateProgress(job.id, MCQImportJob_1.ImportStatus.IN_PROGRESS, processedRows, successfulRows, failedRows, null);
                }
            }
            // 3. Handle errors and cleanup
            if (errors.length > 0) {
                const errorLog = this.createErrorCSV(errors);
                const errorKey = `mcq-imports/${job.templateId}/errors/${job.id}-${Date.now()}.csv`;
                errorFilePath = await this.s3Service.uploadFile(Buffer.from(errorLog), errorKey, 'text/csv');
            }
            // 4. Final status update
            await this.jobRepository.updateProgress(job.id, errors.length > 0 ? MCQImportJob_1.ImportStatus.COMPLETED_WITH_ERRORS : MCQImportJob_1.ImportStatus.COMPLETED, processedRows, successfulRows, failedRows, errorFilePath, undefined, new Date());
        }
        catch (e) {
            // Log critical failure (e.g., S3 download failed, database transaction failed)
            console.error(`[MCQProcessor] Critical failure for job ${jobId}:`, e);
            job.markFailed();
            await this.jobRepository.update(job);
        }
    }
    validateAndMapRow(row, templateId) {
        const { level, question, option_a, option_b, option_c, option_d, correct_answer, explanation } = row;
        // 1. Basic Presence
        if (!level || !question || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
            throw new AppError_1.ValidationError('Missing required fields: level, question, options (A-D), or correct_answer.');
        }
        // 2. Level Validation
        if (!this.validLevels.includes(level.trim())) {
            throw new AppError_1.ValidationError(`Invalid level: ${level}. Must be one of: ${this.validLevels.join(', ')}`);
        }
        // 3. Correct Answer Mapping
        const answerKey = correct_answer.toUpperCase().trim();
        if (!this.validAnswers.includes(answerKey)) {
            throw new AppError_1.ValidationError(`Invalid correct_answer: ${correct_answer}. Must be A, B, C, or D.`);
        }
        const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        const correctAnswerIndex = answerMap[answerKey];
        // 4. Options Array
        const options = [option_a, option_b, option_c, option_d];
        if (options.some(opt => !opt || opt.trim().length === 0)) {
            throw new AppError_1.ValidationError('All options (A, B, C, D) must have content.');
        }
        return {
            templateId,
            level: level.trim(),
            question: question.trim(),
            options: options.map(o => o.trim()),
            correctAnswerIndex,
            explanation: explanation?.trim() || null,
        };
    }
    createErrorCSV(errors) {
        const headers = ['Row_Number', 'Reason', 'Level', 'Question', 'Option_A', 'Option_B', 'Option_C', 'Option_D', 'Correct_Answer', 'Explanation'];
        let csvContent = headers.join(',') + '\n';
        errors.forEach(err => {
            const data = err.data;
            const rowData = [
                err.row,
                `"${err.reason.replace(/"/g, '""')}"`, // Escape quotes in reason
                `"${data.level.replace(/"/g, '""')}"`,
                `"${data.question.replace(/"/g, '""')}"`,
                `"${data.option_a.replace(/"/g, '""')}"`,
                `"${data.option_b.replace(/"/g, '""')}"`,
                `"${data.option_c.replace(/"/g, '""')}"`,
                `"${data.option_d.replace(/"/g, '""')}"`,
                data.correct_answer,
                `"${data.explanation?.replace(/"/g, '""') || ''}"`,
            ];
            csvContent += rowData.join(',') + '\n';
        });
        return csvContent;
    }
};
exports.MCQImportJobProcessor = MCQImportJobProcessor;
exports.MCQImportJobProcessor = MCQImportJobProcessor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IMCQImportJobRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ITemplateQuestionRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IS3Service)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MCQImportJobProcessor);
//# sourceMappingURL=MCQImportJobProcessor.js.map