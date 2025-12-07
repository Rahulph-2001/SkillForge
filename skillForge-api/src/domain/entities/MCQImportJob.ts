import { v4 as uuidv4 } from 'uuid';

export enum ImportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  COMPLETED_WITH_ERRORS = 'completed_with_errors',
  FAILED = 'failed',
}

export interface ImportJobProps {
  id?: string;
  templateId: string;
  adminId: string;
  fileName: string;
  filePath: string; // S3 path or local storage path
  status: ImportStatus;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  errorFilePath: string | null; // S3 path to the CSV error log
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

export class MCQImportJob {
  private readonly props: ImportJobProps;

  constructor(props: ImportJobProps) {
    this.props = {
      id: props.id || uuidv4(),
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
      startedAt: props.startedAt || null,
      completedAt: props.completedAt || null,
      ...props,
      status: props.status || ImportStatus.PENDING,
      totalRows: props.totalRows || 0,
      processedRows: props.processedRows || 0,
      successfulRows: props.successfulRows || 0,
      failedRows: props.failedRows || 0,
      errorFilePath: props.errorFilePath || null,
    };
    this.validate();
  }

  private validate(): void {
    if (!this.props.templateId) throw new Error('Template ID is required for import job');
    if (!this.props.adminId) throw new Error('Admin ID is required for import job');
    if (!this.props.filePath) throw new Error('File path is required for import job');
    if (!this.props.fileName) throw new Error('File name is required for import job');
  }

  // Getters
  get id(): string { return this.props.id!; }
  get templateId(): string { return this.props.templateId; }
  get adminId(): string { return this.props.adminId; }
  get fileName(): string { return this.props.fileName; }
  get filePath(): string { return this.props.filePath; }
  get status(): ImportStatus { return this.props.status; }
  get totalRows(): number { return this.props.totalRows; }
  get processedRows(): number { return this.props.processedRows; }
  get successfulRows(): number { return this.props.successfulRows; }
  get failedRows(): number { return this.props.failedRows; }
  get errorFilePath(): string | null { return this.props.errorFilePath; }
  get createdAt(): Date { return this.props.createdAt!; }
  get updatedAt(): Date { return this.props.updatedAt!; }
  get startedAt(): Date | null { return this.props.startedAt || null; }
  get completedAt(): Date | null { return this.props.completedAt || null; }

  // State Transitions
  startProcessing(totalRows: number): void {
    this.props.status = ImportStatus.IN_PROGRESS;
    this.props.startedAt = new Date();
    this.props.totalRows = totalRows;
    this.props.updatedAt = new Date();
  }

  updateProgress(processed: number, successful: number, failed: number): void {
    this.props.processedRows = processed;
    this.props.successfulRows = successful;
    this.props.failedRows = failed;
    this.props.updatedAt = new Date();
  }

  markCompleted(errorFilePath: string | null = null): void {
    const hasErrors = this.props.failedRows > 0;
    this.props.status = hasErrors ? ImportStatus.COMPLETED_WITH_ERRORS : ImportStatus.COMPLETED;
    this.props.errorFilePath = errorFilePath;
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  markFailed(): void {
    this.props.status = ImportStatus.FAILED;
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}