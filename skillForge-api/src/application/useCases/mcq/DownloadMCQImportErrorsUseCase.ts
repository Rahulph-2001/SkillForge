import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IDownloadMCQImportErrorsUseCase } from './interfaces/IDownloadMCQImportErrorsUseCase';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class DownloadMCQImportErrorsUseCase implements IDownloadMCQImportErrorsUseCase {
    constructor(
        @inject(TYPES.IMCQImportJobRepository) private jobRepository: IMCQImportJobRepository,
        @inject(TYPES.IStorageService) private  storageSevice: IStorageService,
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    ) { }

    async execute(jobId: string, adminId: string): Promise<{ fileStream: NodeJS.ReadableStream; fileName: string; mimeType: string }> {
        // 1. Authorization
        const admin = await this.userRepository.findById(adminId);
        if (!admin || admin.role !== UserRole.ADMIN) {
            throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }

        // 2. Job Existence
        const job = await this.jobRepository.findById(jobId);
        if (!job) {
            throw new NotFoundError('Import job not found');
        }

        // 3. Check for Error File
        if (!job.errorFilePath) {
            throw new NotFoundError('No error file available for this job');
        }

        // 4. Get File Stream from S3
        const fileStream = await this.storageSevice.downloadFileAsStream(job.errorFilePath);
        const fileName = `import-errors-${job.id}.csv`;

        return {
            fileStream,
            fileName,
            mimeType: 'text/csv',
        };
    }
}
