import { IDownloadMCQImportErrorsUseCase } from './interfaces/IDownloadMCQImportErrorsUseCase';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class DownloadMCQImportErrorsUseCase implements IDownloadMCQImportErrorsUseCase {
    private jobRepository;
    private s3Service;
    private userRepository;
    constructor(jobRepository: IMCQImportJobRepository, s3Service: IS3Service, userRepository: IUserRepository);
    execute(jobId: string, adminId: string): Promise<{
        fileStream: NodeJS.ReadableStream;
        fileName: string;
        mimeType: string;
    }>;
}
//# sourceMappingURL=DownloadMCQImportErrorsUseCase.d.ts.map