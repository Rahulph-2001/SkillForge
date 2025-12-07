import { ImportStatus } from '../../../domain/entities/MCQImportJob';
export interface MCQImportJobDTO {
    id: string;
    fileName: string;
    templateId: string;
    adminId: string;
    status: ImportStatus;
    totalRows: number;
    processedRows: number;
    successfulRows: number;
    failedRows: number;
    errorFileUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
}
export interface ListMCQImportJobsResponseDTO {
    jobs: MCQImportJobDTO[];
}
//# sourceMappingURL=MCQImportJobDTO.d.ts.map