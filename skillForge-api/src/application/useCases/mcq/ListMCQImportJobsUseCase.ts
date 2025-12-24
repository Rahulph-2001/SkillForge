import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IListMCQImportJobsUseCase } from './interfaces/IListMCQImportJobsUseCase';
import { ListMCQImportJobsResponseDTO, MCQImportJobDTO } from '../../dto/mcq/MCQImportJobDTO';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IStorageService} from '../../../domain/services/IStorageService';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class ListMCQImportJobsUseCase implements IListMCQImportJobsUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IMCQImportJobRepository) private jobRepository: IMCQImportJobRepository,
    @inject(TYPES.IStorageService) private storageService: IStorageService, // For generating signed URLs later if needed, or just public link
  ) {}

  async execute(templateId: string, adminId: string): Promise<ListMCQImportJobsResponseDTO> {
    // 1. Authorization Check
    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // 2. Fetch Jobs
    const jobs = await this.jobRepository.findByTemplateId(templateId);

    // 3. Map to DTO, including generating error file URL
    const jobDTOs: MCQImportJobDTO[] = jobs.map(job => {
      // NOTE: Assuming S3Service.getFileUrl() exists or we can just use the stored public URL
      const errorFileUrl = job.errorFilePath 
        ? job.errorFilePath // We assume S3Service returns a complete public/signed URL
        : null;

      return {
        id: job.id,
        fileName: job.fileName,
        templateId: job.templateId,
        adminId: job.adminId,
        status: job.status,
        totalRows: job.totalRows,
        processedRows: job.processedRows,
        successfulRows: job.successfulRows,
        failedRows: job.failedRows,
        errorFileUrl,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
      };
    });

    return { jobs: jobDTOs };
  }
}