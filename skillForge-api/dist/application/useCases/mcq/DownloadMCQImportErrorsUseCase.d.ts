import { IDownloadMCQImportErrorsUseCase } from './interfaces/IDownloadMCQImportErrorsUseCase';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class DownloadMCQImportErrorsUseCase implements IDownloadMCQImportErrorsUseCase {
    private jobRepository;
    private storageSevice;
    private userRepository;
    constructor(jobRepository: IMCQImportJobRepository, storageSevice: IStorageService, userRepository: IUserRepository);
    execute(jobId: string, adminId: string): Promise<{
        fileStream: NodeJS.ReadableStream;
        fileName: string;
        mimeType: string;
    }>;
}
//# sourceMappingURL=DownloadMCQImportErrorsUseCase.d.ts.map