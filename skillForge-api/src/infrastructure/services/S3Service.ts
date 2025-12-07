import { injectable } from 'inversify';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { IS3Service } from '../../domain/services/IS3Service';
import { env } from '../../config/env';
import { NotFoundError } from '../../domain/errors/AppError';
import { Readable } from 'stream';


@injectable()
export class S3Service implements IS3Service {
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
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimeType,
      // ACL removed - using bucket policy for public access instead
    });

    try {
      await this.s3Client.send(command);

      // Construct public URL
      const url = `https://${this.bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
      return url;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {

    const urlParts = fileUrl.split('/');

    const key = urlParts.slice(3).join('/');

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
  // NEW: Download file content as a Buffer (for the processor)
  async downloadFile(fileUrl: string): Promise<Buffer> {
    const key = this.urlToKey(fileUrl);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new NotFoundError('File not found in S3 or is empty');
      }

      // Convert stream to Buffer
      const stream = response.Body as NodeJS.ReadableStream;
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk as Buffer));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });

    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        throw new NotFoundError('S3 file not found');
      }
      throw error;
    }
  }

  // NEW: Download file content as a Stream (for direct HTTP response)
  async downloadFileAsStream(fileUrl: string): Promise<NodeJS.ReadableStream> {
    const key = this.urlToKey(fileUrl);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new NotFoundError('File not found in S3 or is empty');
      }

      return response.Body as NodeJS.ReadableStream;

    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        throw new NotFoundError('S3 file not found');
      }
      throw error;
    }
  }

  private urlToKey(fileUrl: string): string {
    const urlParts = fileUrl.split(`/${this.bucketName}.s3.${env.AWS_REGION}.amazonaws.com/`);
    if (urlParts.length === 2) {
      return urlParts[1];
    }
    // Assume it's already a key if not a full S3 URL (e.g., if we stored the key directly)
    return fileUrl;
  }
}