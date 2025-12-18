import { IS3Service } from '../../domain/services/IS3Service';
export declare class S3Service implements IS3Service {
    private s3Client;
    private bucketName;
    constructor();
    uploadFile(file: Buffer, key: string, mimeType: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
    downloadFile(fileUrl: string): Promise<Buffer>;
    downloadFileAsStream(fileUrl: string): Promise<NodeJS.ReadableStream>;
    private urlToKey;
}
//# sourceMappingURL=S3Service.d.ts.map