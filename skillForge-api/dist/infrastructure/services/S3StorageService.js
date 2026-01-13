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
            return url;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteFile(fileUrl) {
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(3).join('/');
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(command);
    }
    async downloadFile(fileUrl) {
        const key = this.urlToKey(fileUrl);
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            const response = await this.s3Client.send(command);
            if (!response.Body) {
                throw new AppError_1.NotFoundError('File not found in storage or is empty');
            }
            const stream = response.Body;
            return new Promise((resolve, reject) => {
                const chunks = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('error', reject);
                stream.on('end', () => resolve(Buffer.concat(chunks)));
            });
        }
        catch (error) {
            if (error.name === 'NoSuchKey') {
                throw new AppError_1.NotFoundError('File not found in storage');
            }
            throw error;
        }
    }
    async downloadFileAsStream(fileUrl) {
        const key = this.urlToKey(fileUrl);
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
        const urlParts = fileUrl.split(`/${this.bucketName}.s3.${env_1.env.AWS_REGION}.amazonaws.com/`);
        if (urlParts.length === 2) {
            return urlParts[1];
        }
        return fileUrl;
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], S3StorageService);
//# sourceMappingURL=S3StorageService.js.map