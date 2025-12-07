export interface IS3Service {
  uploadFile(file: Buffer, key: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  downloadFile(fileKey: string): Promise<Buffer>;
  downloadFileAsStream(fileKey: string): Promise<NodeJS.ReadableStream>;
}