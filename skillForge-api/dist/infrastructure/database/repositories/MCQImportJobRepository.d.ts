import { Database } from '../Database';
import { MCQImportJob, ImportStatus } from '../../../domain/entities/MCQImportJob';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { BaseRepository } from '../BaseRepository';
export declare class MCQImportJobRepository extends BaseRepository<MCQImportJob> implements IMCQImportJobRepository {
    constructor(db: Database);
    private toDomain;
    private toPersistence;
    create(job: MCQImportJob): Promise<MCQImportJob>;
    findById(id: string): Promise<MCQImportJob | null>;
    findByTemplateId(templateId: string): Promise<MCQImportJob[]>;
    update(job: MCQImportJob): Promise<MCQImportJob>;
    updateProgress(jobId: string, status: ImportStatus, processedRows: number, successfulRows: number, failedRows: number, errorFilePath: string | null, startedAt?: Date, completedAt?: Date): Promise<MCQImportJob>;
}
//# sourceMappingURL=MCQImportJobRepository.d.ts.map