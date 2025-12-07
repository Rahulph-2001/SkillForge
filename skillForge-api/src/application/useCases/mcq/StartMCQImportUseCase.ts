import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IStartMCQImportUseCase } from './interfaces/IStartMCQImportUseCase';
import { StartMCQImportRequestDTO, StartMCQImportResponseDTO } from '../../dto/mcq/StartMCQImportDTO';
import { IS3Service } from '../../../domain/services/IS3Service';
import { IJobQueueService, JobQueueName } from '../../../domain/services/IJobQueueService';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { MCQImportJob, ImportStatus } from '../../../domain/entities/MCQImportJob';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import csv from 'csv-parser';
import { Readable } from 'stream';

@injectable()
export class StartMCQImportUseCase implements IStartMCQImportUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISkillTemplateRepository) private templateRepository: ISkillTemplateRepository,
    @inject(TYPES.IS3Service) private s3Service: IS3Service,
    @inject(TYPES.IMCQImportJobRepository) private jobRepository: IMCQImportJobRepository,
    @inject(TYPES.IJobQueueService) private jobQueueService: IJobQueueService,
  ) {}

  async execute(request: StartMCQImportRequestDTO, file: Express.Multer.File): Promise<StartMCQImportResponseDTO> {
    const { templateId, adminId } = request;

    // 1. Authorization Check
    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // 2. Template Existence Check
    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new NotFoundError('Skill template not found');
    }

    // 3. Basic File Validation (Content/Format)
    if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
      throw new ValidationError('Only CSV files are supported for bulk import');
    }

    // 4. Count Rows for Context (Pre-pass)
    const rowCount = await this.countRows(file.buffer);

    if (rowCount === 0) {
      throw new ValidationError('The uploaded CSV file is empty');
    }

    // 5. Upload File to S3
    const key = `mcq-imports/${templateId}/${Date.now()}-${file.originalname}`;
    const filePath = await this.s3Service.uploadFile(file.buffer, key, file.mimetype);

    // 6. Create Pending Import Job Record
    const job = new MCQImportJob({
      templateId,
      adminId,
      fileName: file.originalname,
      filePath,
      status: ImportStatus.PENDING,
      totalRows: rowCount,
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      errorFilePath: null,
    });

    const createdJob = await this.jobRepository.create(job);

    // 7. Queue the Job
    await this.jobQueueService.addJob(JobQueueName.MCQ_IMPORT, {
      jobId: createdJob.id,
      filePath: createdJob.filePath,
      templateId: createdJob.templateId,
    });

    return {
      jobId: createdJob.id,
      fileName: createdJob.fileName,
      status: 'PENDING',
      message: 'Import job initiated. Check status endpoint for progress.',
    };
  }
  
  private async countRows(buffer: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {
      let count = 0;
      const stream = Readable.from(buffer);
      stream
        .pipe(csv())
        .on('data', () => count++)
        .on('end', () => resolve(count))
        .on('error', (err) => reject(new ValidationError('Failed to parse CSV file: ' + err.message)));
    });
  }
}