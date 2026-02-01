"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageService = void 0;
const inversify_1 = require("inversify");
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("../../config/env");
const AppError_1 = require("../../domain/errors/AppError");
let S3StorageService = class S3StorageService {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: env_1.env.AWS_REGION,
            credentials: {
                accessKeyId: env_1.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env_1.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.bucketName = env_1.env.AWS_S3_BUCKET_NAME;
    }
    async uploadFile(file, key, mimeType) {
        console.log('[S3StorageService] Uploading file:', {
            key,
            size: file.length,
            mimeType,
            bucket: this.bucketName,
            region: env_1.env.AWS_REGION
        });
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: mimeType,
        });
        try {
            await this.s3Client.send(command);
            // Properly encode the key in the URL to handle special characters
            const encodedKey = encodeURIComponent(key).replace(/%2F/g, '/'); // Keep slashes unencoded
            const url = `https://${this.bucketName}.s3.${env_1.env.AWS_REGION}.amazonaws.com/${encodedKey}`;
            console.log('[S3StorageService] File uploaded successfully:', { url });
            return url;
        }
        catch (error) {
            console.error('[S3StorageService] Upload failed:', {
                message: error.message,
                code: error.code,
                key
            });
            throw error;
        }
    }
    async deleteFile(fileUrl) {
        console.log('[S3StorageService] Deleting file:', { fileUrl });
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(3).join('/');
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            await this.s3Client.send(command);
            console.log('[S3StorageService] File deleted successfully:', { key });
        }
        catch (error) {
            console.error('[S3StorageService] Delete failed:', {
                message: error.message,
                code: error.code,
                key
            });
            throw error;
        }
    }
    async downloadFile(fileUrl) {
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
                const command = new client_s3_1.GetObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                });
                const response = await this.s3Client.send(command);
                if (!response.Body) {
                    console.error('[S3StorageService] File body is empty:', { key });
                    throw new AppError_1.NotFoundError('File not found in storage or is empty');
                }
                const stream = response.Body;
                const buffer = await new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on('data', (chunk) => chunks.push(chunk));
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
            }
            catch (error) {
                const isLastAttempt = attempt === maxRetries;
                if (error.name === 'NoSuchKey' && !isLastAttempt) {
                    const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
                    console.warn(`[S3StorageService] File not found (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`, { key });
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                if (error.name === 'NoSuchKey') {
                    console.error('[S3StorageService] File not found after all retries:', { key, fileUrl, attempts: maxRetries });
                    throw new AppError_1.NotFoundError('File not found in storage');
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
        throw new AppError_1.NotFoundError('File not found in storage after retries');
    }
    async downloadFileAsStream(fileUrl) {
        const key = this.urlToKey(fileUrl);
        console.log('[S3StorageService] Downloading file as stream:', {
            fileUrl,
            key,
            bucket: this.bucketName
        });
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            const response = await this.s3Client.send(command);
            if (!response.Body) {
                throw new AppError_1.NotFoundError('File not found in storage or is empty');
            }
            return response.Body;
        }
        catch (error) {
            if (error.name === 'NoSuchKey') {
                throw new AppError_1.NotFoundError('File not found in storage');
            }
            throw error;
        }
    }
    urlToKey(fileUrl) {
        // Try the standard S3 URL format
        const urlParts = fileUrl.split(`${this.bucketName}.s3.${env_1.env.AWS_REGION}.amazonaws.com/`);
        if (urlParts.length === 2) {
            // Decode the URL-encoded key to get the actual S3 key with spaces
            return decodeURIComponent(urlParts[1]);
        }
        // Fallback: decode the entire URL if it's just a key
        return decodeURIComponent(fileUrl);
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], S3StorageService);
//# sourceMappingURL=S3StorageService.js.map