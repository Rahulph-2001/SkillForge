import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { ImportStatus } from '../../../domain/entities/MCQImportJob';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { v4 as uuidv4 } from 'uuid';
import { AppError, ValidationError } from '../../../domain/errors/AppError';

// Define the expected CSV headers
interface CSVQuestionRow {
    level: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string; // A, B, C, or D
    explanation: string;
}

@injectable()
export class MCQImportJobProcessor {
    private readonly validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    private readonly validAnswers = ['A', 'B', 'C', 'D'];

    constructor(
        @inject(TYPES.IMCQImportJobRepository) private jobRepository: IMCQImportJobRepository,
        @inject(TYPES.ITemplateQuestionRepository) private questionRepository: ITemplateQuestionRepository,
        @inject(TYPES.IS3Service) private s3Service: IS3Service,
    ) { }

    public async execute(jobId: string): Promise<void> {
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
        const errors: { row: number; reason: string; data: any }[] = [];
        let errorFilePath: string | null = null;
        let totalRowsCount = 0;

        try {
            // 1. Download file from S3
            const fileBuffer = await this.s3Service.downloadFile(job.filePath);
            const stream = Readable.from(fileBuffer);

            const parser = stream.pipe(csv());

            // 2. Process rows iteratively
            for await (const row of parser) {
                totalRowsCount++;
                const rowNumber = totalRowsCount;
                processedRows++;

                try {
                    // A. Map and Validate row
                    const questionData = this.validateAndMapRow(row as CSVQuestionRow, job.templateId);

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

                // C. Update progress every N rows (e.g., every 50 rows or if it's the last row)
                if (processedRows % 50 === 0 || processedRows === job.totalRows) {
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

            // 3. Handle errors and cleanup
            if (errors.length > 0) {
                const errorLog = this.createErrorCSV(errors);
                const errorKey = `mcq-imports/${job.templateId}/errors/${job.id}-${Date.now()}.csv`;
                errorFilePath = await this.s3Service.uploadFile(Buffer.from(errorLog), errorKey, 'text/csv');
            }

            // 4. Final status update
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
            // Log critical failure (e.g., S3 download failed, database transaction failed)
            console.error(`[MCQProcessor] Critical failure for job ${jobId}:`, e);
            job.markFailed();
            await this.jobRepository.update(job);
        }
    }

    private validateAndMapRow(row: CSVQuestionRow, templateId: string) {
        const { level, question, option_a, option_b, option_c, option_d, correct_answer, explanation } = row;

        // 1. Basic Presence
        if (!level || !question || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
            throw new ValidationError('Missing required fields: level, question, options (A-D), or correct_answer.');
        }

        // 2. Level Validation
        if (!this.validLevels.includes(level.trim())) {
            throw new ValidationError(`Invalid level: ${level}. Must be one of: ${this.validLevels.join(', ')}`);
        }

        // 3. Correct Answer Mapping
        const answerKey = correct_answer.toUpperCase().trim();
        if (!this.validAnswers.includes(answerKey)) {
            throw new ValidationError(`Invalid correct_answer: ${correct_answer}. Must be A, B, C, or D.`);
        }

        const answerMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        const correctAnswerIndex = answerMap[answerKey];

        // 4. Options Array
        const options = [option_a, option_b, option_c, option_d];
        if (options.some(opt => !opt || opt.trim().length === 0)) {
            throw new ValidationError('All options (A, B, C, D) must have content.');
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

    private createErrorCSV(errors: { row: number; reason: string; data: any }[]): string {
        const headers = ['Row_Number', 'Reason', 'Level', 'Question', 'Option_A', 'Option_B', 'Option_C', 'Option_D', 'Correct_Answer', 'Explanation'];
        let csvContent = headers.join(',') + '\n';

        errors.forEach(err => {
            const data = err.data as CSVQuestionRow;
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
}