import { IStorageService } from '../../domain/services/IStorageService';
export declare class S3StorageService implements IStorageService {
    private s3Client;
    private bucketName;
    constructor();
    uploadFile(file: Buffer, key: string, mimeType: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
    downloadFile(fileUrl: string): Promise<Buffer>;
    downloadFileAsStream(fileUrl: string): Promise<NodeJS.ReadableStream>;
    private urlToKey;
}
//# sourceMappingURL=S3StorageService.d.ts.map