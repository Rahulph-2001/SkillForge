import { injectable } from 'inversify';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IS3Service } from '../../domain/services/IS3Service';
import { env } from '../../config/env';

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
}