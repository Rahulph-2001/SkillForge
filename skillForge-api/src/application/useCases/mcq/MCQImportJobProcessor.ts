import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { ImportStatus } from '../../../domain/entities/MCQImportJob';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { v4 as uuidv4 } from 'uuid';
import { AppError, ValidationError } from '../../../domain/errors/AppError';
import * as XLSX from 'xlsx'; 


interface ProcessedRowData {
    level: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    explanation: string;
}

@injectable()
export class MCQImportJobProcessor {
    private readonly validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    private readonly validAnswers = ['A', 'B', 'C', 'D'];

    constructor(
        @inject(TYPES.IMCQImportJobRepository) private jobRepository: IMCQImportJobRepository,
        @inject(TYPES.ITemplateQuestionRepository) private questionRepository: ITemplateQuestionRepository,
        @inject(TYPES.IStorageService) private storageService: IStorageService,
    ) { }

    public async execute(jobId: string): Promise<void> {
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
        const errors: { row: number; reason: string; data: any }[] = [];
        let errorFilePath: string | null = null;

        try {
            // 1. Download file from S3
            console.log(`[MCQProcessor] Downloading file from S3:`, { filePath: job.filePath });
            let fileBuffer: Buffer;
            try {
                fileBuffer = await this.storageService.downloadFile(job.filePath);
                console.log(`[MCQProcessor] File downloaded successfully:`, { size: fileBuffer.length });
            } catch (error: any) {
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
            let rowsToProcess: any[] = [];

            if (isExcel) {
                rowsToProcess = this.parseExcel(fileBuffer);
            } else {
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
                    const question = TemplateQuestion.create(
                        uuidv4(),
                        questionData.templateId,
                        questionData.level,
                        questionData.question,
                        questionData.options,
                        questionData.correctAnswerIndex,
                        questionData.explanation,
                        true,
                        new Date(),
                        new Date()
                    );
                    await this.questionRepository.create(question);
                    successfulRows++;

                } catch (e: any) {
                    failedRows++;
                    errors.push({
                        row: rowNumber,
                        reason: e instanceof AppError ? e.message : e.message || 'Unknown validation error',
                        data: row
                    });
                }

                // C. Update progress every 50 rows
                if (processedRows % 50 === 0) {
                    await this.jobRepository.updateProgress(
                        job.id,
                        ImportStatus.IN_PROGRESS,
                        processedRows,
                        successfulRows,
                        failedRows,
                        null
                    );
                }
            }

            // 4. Handle errors and cleanup
            if (errors.length > 0) {
                const errorLog = this.createErrorCSV(errors);
                const errorKey = `mcq-imports/${job.templateId}/errors/${job.id}-${Date.now()}.csv`;
                errorFilePath = await this.storageService.uploadFile(Buffer.from(errorLog), errorKey, 'text/csv');
            }

            // 5. Final status update
            await this.jobRepository.updateProgress(
                job.id,
                errors.length > 0 ? ImportStatus.COMPLETED_WITH_ERRORS : ImportStatus.COMPLETED,
                processedRows,
                successfulRows,
                failedRows,
                errorFilePath,
                undefined,
                new Date()
            );
        } catch (e) {
            console.error(`[MCQProcessor] Critical failure for job ${jobId}:`, e);
            job.markFailed();
            await this.jobRepository.update(job);
        }
    }

    private parseExcel(buffer: Buffer): any[] {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Parse to JSON
        const rawData = XLSX.utils.sheet_to_json(sheet);
        
        
        return rawData.map((row: any) => {
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

    private parseCSV(buffer: Buffer): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const results: any[] = [];
            const stream = Readable.from(buffer);
            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (err) => reject(err));
        });
    }

    private validateAndMapRow(row: any, templateId: string) {
        
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
            throw new ValidationError('Missing required fields: level, question, options (A-D), or correctAnswer.');
        }

        // 2. Level Validation
        if (!this.validLevels.includes(level.trim())) {
            throw new ValidationError(`Invalid level: ${level}. Must be one of: ${this.validLevels.join(', ')}`);
        }

        // 3. Correct Answer Mapping
        const answerKey = correctAnswer.toString().toUpperCase().trim();
        if (!this.validAnswers.includes(answerKey)) {
            throw new ValidationError(`Invalid correctAnswer: ${correctAnswer}. Must be A, B, C, or D.`);
        }

        const answerMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        const correctAnswerIndex = answerMap[answerKey];

        // 4. Options Array
        const options = [optionA, optionB, optionC, optionD].map(String);
        if (options.some(opt => !opt || opt.trim().length === 0)) {
            throw new ValidationError('All options (A, B, C, D) must have content.');
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
    private createErrorCSV(errors: { row: number; reason: string; data: any }[]): string {
        const headers = ['Row_Number', 'Reason', 'Level', 'Question', 'Option_A', 'Option_B', 'Option_C', 'Option_D', 'Correct_Answer', 'Explanation'];
        let csvContent = headers.join(',') + '\n';

        errors.forEach(err => {
            const data = err.data as ProcessedRowData;
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
}