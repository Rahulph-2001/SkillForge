export interface StartMCQImportRequestDTO {
  templateId: string;
  adminId: string;
}

export interface StartMCQImportResponseDTO {
  jobId: string;
  fileName: string;
  status: 'PENDING';
  message: 'Import job initiated. Check status endpoint for progress.';
}