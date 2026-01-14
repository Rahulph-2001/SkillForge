import { injectable } from 'inversify';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { IStorageService } from '../../domain/services/IStorageService';
import { env } from '../../config/env';
import { NotFoundError } from '../../domain/errors/AppError';

@injectable()
export class S3StorageService implements IStorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = env.AWS_S3_BUCKET_NAME;
  }

  async uploadFile(file: Buffer, key: string, mimeType: string): Promise<string> {
    console.log('[S3StorageService] Uploading file:', {
      key,
      size: file.length,
      mimeType,
      bucket: this.bucketName,
      region: env.AWS_REGION
    });

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimeType,
    });

    try {
      await this.s3Client.send(command);
      // Properly encode the key in the URL to handle special characters
      const encodedKey = encodeURIComponent(key).replace(/%2F/g, '/'); // Keep slashes unencoded
      const url = `https://${this.bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${encodedKey}`;
      console.log('[S3StorageService] File uploaded successfully:', { url });
      return url;
    } catch (error: any) {
      console.error('[S3StorageService] Upload failed:', {
        message: error.message,
        code: error.code,
        key
      });
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    console.log('[S3StorageService] Deleting file:', { fileUrl });
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(3).join('/');

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      console.log('[S3StorageService] File deleted successfully:', { key });
    } catch (error: any) {
      console.error('[S3StorageService] Delete failed:', {
        message: error.message,
        code: error.code,
        key
      });
      throw error;
    }
  }

  async downloadFile(fileUrl: string): Promise<Buffer> {
    const key = this.urlToKey(fileUrl);
    console.log('[S3StorageService] Downloading file:', {
      fileUrl,
      key,
      bucket: this.bucketName
    });

    // Retry logic for S3 eventual consistency
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });

        const response = await this.s3Client.send(command);

        if (!response.Body) {
          console.error('[S3StorageService] File body is empty:', { key });
          throw new NotFoundError('File not found in storage or is empty');
        }

        const stream = response.Body as NodeJS.ReadableStream;
        const buffer = await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on('data', (chunk) => chunks.push(chunk as Buffer));
          stream.on('error', (err) => {
            console.error('[S3StorageService] Stream error:', { key, error: err.message });
            reject(err);
          });
          stream.on('end', () => {
            resolve(Buffer.concat(chunks));
          });
        });

        console.log('[S3StorageService] File downloaded successfully:', { key, size: buffer.length, attempt });
        return buffer;

      } catch (error: any) {
        const isLastAttempt = attempt === maxRetries;
        
        if (error.name === 'NoSuchKey' && !isLastAttempt) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.warn(`[S3StorageService] File not found (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`, { key });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (error.name === 'NoSuchKey') {
          console.error('[S3StorageService] File not found after all retries:', { key, fileUrl, attempts: maxRetries });
          throw new NotFoundError('File not found in storage');
        }

        console.error('[S3StorageService] Download failed:', {
          message: error.message,
          name: error.name,
          code: error.code,
          key,
          attempt
        });
        throw error;
      }
    }

    throw new NotFoundError('File not found in storage after retries');
  }

  async downloadFileAsStream(fileUrl: string): Promise<NodeJS.ReadableStream> {
    const key = this.urlToKey(fileUrl);
    console.log('[S3StorageService] Downloading file as stream:', {
      fileUrl,
      key,
      bucket: this.bucketName
    });

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new NotFoundError('File not found in storage or is empty');
      }

      return response.Body as NodeJS.ReadableStream;

    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        throw new NotFoundError('File not found in storage');
      }
      throw error;
    }
  }

  private urlToKey(fileUrl: string): string {
    // Try the standard S3 URL format
    const urlParts = fileUrl.split(`${this.bucketName}.s3.${env.AWS_REGION}.amazonaws.com/`);
    if (urlParts.length === 2) {
      // Decode the URL-encoded key to get the actual S3 key with spaces
      return decodeURIComponent(urlParts[1]);
    }
    // Fallback: decode the entire URL if it's just a key
    return decodeURIComponent(fileUrl);
  }
}