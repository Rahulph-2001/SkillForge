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
exports.MCQImportJobProcessor = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const MCQImportJob_1 = require("../../../domain/entities/MCQImportJob");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const TemplateQuestion_1 = require("../../../domain/entities/TemplateQuestion");
const uuid_1 = require("uuid");
const AppError_1 = require("../../../domain/errors/AppError");
const XLSX = __importStar(require("xlsx"));
let MCQImportJobProcessor = class MCQImportJobProcessor {
    constructor(jobRepository, questionRepository, storageService) {
        this.jobRepository = jobRepository;
        this.questionRepository = questionRepository;
        this.storageService = storageService;
        this.validLevels = ['Beginner', 'Intermediate', 'Advanced'];
        this.validAnswers = ['A', 'B', 'C', 'D'];
    }
    async execute(jobId) {
        console.log(`[MCQProcessor] Starting job execution:`, { jobId });
        const job = await this.jobRepository.findById(jobId);
        if (!job) {
            console.error(`[MCQProcessor] Job ${jobId} not found in database`);
            return;
        }
        console.log(`[MCQProcessor] Job found:`, {
            jobId: job.id,
            fileName: job.fileName,
            filePath: job.filePath,
            totalRows: job.totalRows,
            status: job.status
        });
        job.startProcessing(job.totalRows);
        await this.jobRepository.update(job);
        console.log(`[MCQProcessor] Job marked as IN_PROGRESS`);
        let processedRows = 0;
        let successfulRows = 0;
        let failedRows = 0;
        const errors = [];
        let errorFilePath = null;
        try {
            // 1. Download file from S3
            console.log(`[MCQProcessor] Downloading file from S3:`, { filePath: job.filePath });
            let fileBuffer;
            try {
                fileBuffer = await this.storageService.downloadFile(job.filePath);
                console.log(`[MCQProcessor] File downloaded successfully:`, { size: fileBuffer.length });
            }
            catch (error) {
                if (error.statusCode === 404 || error.name === 'NotFoundError') {
                    console.error(`[MCQProcessor] File not found in S3:`, {
                        jobId,
                        filePath: job.filePath,
                        error: error.message
                    });
                    job.markFailed();
                    await this.jobRepository.update(job);
                    return;
                }
                console.error(`[MCQProcessor] Error downloading file:`, {
                    jobId,
                    error: error.message,
                    stack: error.stack
                });
                throw error;
            }
            // 2. Determine file type and parse
            const isExcel = job.fileName.endsWith('.xlsx') || job.fileName.endsWith('.xls');
            console.log(`[MCQProcessor] Parsing file:`, { fileName: job.fileName, isExcel });
            let rowsToProcess = [];
            if (isExcel) {
                rowsToProcess = this.parseExcel(fileBuffer);
            }
            else {
                rowsToProcess = await this.parseCSV(fileBuffer);
            }
            console.log(`[MCQProcessor] File parsed:`, { totalRows: rowsToProcess.length });
            // 3. Process rows iteratively
            for (const [index, row] of rowsToProcess.entries()) {
                const rowNumber = index + 1;
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
                // C. Update progress every 50 rows
                if (processedRows % 50 === 0) {
                    await this.jobRepository.updateProgress(job.id, MCQImportJob_1.ImportStatus.IN_PROGRESS, processedRows, successfulRows, failedRows, null);
                }
            }
            // 4. Handle errors and cleanup
            if (errors.length > 0) {
                const errorLog = this.createErrorCSV(errors);
                const errorKey = `mcq-imports/${job.templateId}/errors/${job.id}-${Date.now()}.csv`;
                errorFilePath = await this.storageService.uploadFile(Buffer.from(errorLog), errorKey, 'text/csv');
            }
            // 5. Final status update
            await this.jobRepository.updateProgress(job.id, errors.length > 0 ? MCQImportJob_1.ImportStatus.COMPLETED_WITH_ERRORS : MCQImportJob_1.ImportStatus.COMPLETED, processedRows, successfulRows, failedRows, errorFilePath, undefined, new Date());
        }
        catch (e) {
            console.error(`[MCQProcessor] Critical failure for job ${jobId}:`, e);
            job.markFailed();
            await this.jobRepository.update(job);
        }
    }
    parseExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Parse to JSON
        const rawData = XLSX.utils.sheet_to_json(sheet);
        return rawData.map((row) => {
            return {
                level: row['Level'] || row['level'],
                question: row['Question'] || row['question'],
                optionA: row['Option A'] || row['option_a'] || row['Option_A'] || row['optionA'],
                optionB: row['Option B'] || row['option_b'] || row['Option_B'] || row['optionB'],
                optionC: row['Option C'] || row['option_c'] || row['Option_C'] || row['optionC'],
                optionD: row['Option D'] || row['option_d'] || row['Option_D'] || row['optionD'],
                correctAnswer: row['Correct Answer'] || row['correct_answer'] || row['CorrectAnswer'] || row['correctAnswer'],
                explanation: row['Explanation'] || row['explanation']
            };
        });
    }
    parseCSV(buffer) {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = stream_1.Readable.from(buffer);
            stream
                .pipe((0, csv_parser_1.default)())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (err) => reject(err));
        });
    }
    validateAndMapRow(row, templateId) {
        const level = row.level || row.Level;
        const question = row.question || row.Question;
        const optionA = row.optionA || row.option_a || row['Option A'] || row.Option_A;
        const optionB = row.optionB || row.option_b || row['Option B'] || row.Option_B;
        const optionC = row.optionC || row.option_c || row['Option C'] || row.Option_C;
        const optionD = row.optionD || row.option_d || row['Option D'] || row.Option_D;
        const correctAnswer = row.correctAnswer || row.correct_answer || row['Correct Answer'] || row.CorrectAnswer;
        const explanation = row.explanation || row.Explanation;
        // 1. Basic Presence
        if (!level || !question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
            throw new AppError_1.ValidationError('Missing required fields: level, question, options (A-D), or correctAnswer.');
        }
        // 2. Level Validation
        if (!this.validLevels.includes(level.trim())) {
            throw new AppError_1.ValidationError(`Invalid level: ${level}. Must be one of: ${this.validLevels.join(', ')}`);
        }
        // 3. Correct Answer Mapping
        const answerKey = correctAnswer.toString().toUpperCase().trim();
        if (!this.validAnswers.includes(answerKey)) {
            throw new AppError_1.ValidationError(`Invalid correctAnswer: ${correctAnswer}. Must be A, B, C, or D.`);
        }
        const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        const correctAnswerIndex = answerMap[answerKey];
        // 4. Options Array
        const options = [optionA, optionB, optionC, optionD].map(String);
        if (options.some(opt => !opt || opt.trim().length === 0)) {
            throw new AppError_1.ValidationError('All options (A, B, C, D) must have content.');
        }
        return {
            templateId,
            level: level.trim(),
            question: question.trim(),
            options: options.map(o => o.trim()),
            correctAnswerIndex,
            explanation: explanation?.toString().trim() || null,
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
                `"${data.optionA.replace(/"/g, '""')}"`,
                `"${data.optionB.replace(/"/g, '""')}"`,
                `"${data.optionC.replace(/"/g, '""')}"`,
                `"${data.optionD.replace(/"/g, '""')}"`,
                data.correctAnswer,
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
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MCQImportJobProcessor);
//# sourceMappingURL=MCQImportJobProcessor.js.map