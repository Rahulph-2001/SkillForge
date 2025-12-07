import { MCQImportJob, ImportStatus } from '../entities/MCQImportJob';
export interface IMCQImportJobRepository {
    create(job: MCQImportJob): Promise<MCQImportJob>;
    findById(id: string): Promise<MCQImportJob | null>;
    findByTemplateId(templateId: string): Promise<MCQImportJob[]>;
    update(job: MCQImportJob): Promise<MCQImportJob>;
    updateProgress(jobId: string, status: ImportStatus, processedRows: number, successfulRows: number, failedRows: number, errorFilePath: string | null, startedAt?: Date, completedAt?: Date): Promise<MCQImportJob>;
}
//# sourceMappingURL=IMCQImportJobRepository.d.ts.map