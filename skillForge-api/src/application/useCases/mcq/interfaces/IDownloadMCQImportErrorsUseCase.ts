export interface IDownloadMCQImportErrorsUseCase {
  execute(jobId: string, adminId: string): Promise<{ fileStream: NodeJS.ReadableStream; fileName: string; mimeType: string }>;
}