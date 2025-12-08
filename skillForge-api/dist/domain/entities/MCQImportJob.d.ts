export declare enum ImportStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    COMPLETED_WITH_ERRORS = "completed_with_errors",
    FAILED = "failed"
}
export interface ImportJobProps {
    id?: string;
    templateId: string;
    adminId: string;
    fileName: string;
    filePath: string;
    status: ImportStatus;
    totalRows: number;
    processedRows: number;
    successfulRows: number;
    failedRows: number;
    errorFilePath: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    startedAt?: Date | null;
    completedAt?: Date | null;
}
export declare class MCQImportJob {
    private readonly props;
    constructor(props: ImportJobProps);
    private validate;
    get id(): string;
    get templateId(): string;
    get adminId(): string;
    get fileName(): string;
    get filePath(): string;
    get status(): ImportStatus;
    get totalRows(): number;
    get processedRows(): number;
    get successfulRows(): number;
    get failedRows(): number;
    get errorFilePath(): string | null;
    get createdAt(): Date;
    get updatedAt(): Date;
    get startedAt(): Date | null;
    get completedAt(): Date | null;
    startProcessing(totalRows: number): void;
    updateProgress(processed: number, successful: number, failed: number): void;
    markCompleted(errorFilePath?: string | null): void;
    markFailed(): void;
    toJSON(): {
        id?: string;
        templateId: string;
        adminId: string;
        fileName: string;
        filePath: string;
        status: ImportStatus;
        totalRows: number;
        processedRows: number;
        successfulRows: number;
        failedRows: number;
        errorFilePath: string | null;
        createdAt?: Date;
        updatedAt?: Date;
        startedAt?: Date | null;
        completedAt?: Date | null;
    };
}
//# sourceMappingURL=MCQImportJob.d.ts.map