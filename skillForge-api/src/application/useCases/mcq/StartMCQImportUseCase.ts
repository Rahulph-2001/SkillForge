import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IStartMCQImportUseCase } from './interfaces/IStartMCQImportUseCase';
import { StartMCQImportRequestDTO, StartMCQImportResponseDTO } from '../../dto/mcq/StartMCQImportDTO';
import { IStorageService } from '../../../domain/services/IStorageService';
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
import * as XLSX from 'xlsx';

@injectable()
export class StartMCQImportUseCase implements IStartMCQImportUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISkillTemplateRepository) private templateRepository: ISkillTemplateRepository,
    @inject(TYPES.IStorageService) private storageService: IStorageService,
    @inject(TYPES.IMCQImportJobRepository) private jobRepository: IMCQImportJobRepository,
    @inject(TYPES.IJobQueueService) private jobQueueService: IJobQueueService,
  ) {}

  async execute(request: StartMCQImportRequestDTO, file: Express.Multer.File): Promise<StartMCQImportResponseDTO> {
    const { templateId, adminId } = request;

    console.log('[StartMCQImportUseCase] Starting import process:', {
      templateId,
      adminId,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype
    });

    // 1. Authorization Check
    console.log('[StartMCQImportUseCase] Checking admin authorization');
    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      console.error('[StartMCQImportUseCase] Authorization failed:', { adminId, hasAdmin: !!admin, role: admin?.role });
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }
    console.log('[StartMCQImportUseCase] Admin authorized:', { adminId, adminName: admin.name });

    // 2. Template Existence Check
    console.log('[StartMCQImportUseCase] Checking template existence:', { templateId });
    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      console.error('[StartMCQImportUseCase] Template not found:', { templateId });
      throw new NotFoundError('Skill template not found');
    }
    console.log('[StartMCQImportUseCase] Template found:', { templateId });

    // 3. File Type Validation
    console.log('[StartMCQImportUseCase] Validating file type:', { mimeType: file.mimetype, fileName: file.originalname });
    const allowedMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if(!allowedMimes.includes(file.mimetype)){
      console.error('[StartMCQImportUseCase] Invalid file type:', { mimeType: file.mimetype, allowedMimes });
      throw new ValidationError('Only CSV and Excel (.xlsx, .xls) files are supported')
    }
    console.log('[StartMCQImportUseCase] File type validation passed');
    
    // 4. Count Rows for Context (Pre-pass)
    console.log('[StartMCQImportUseCase] Counting rows in file');
    const rowCount = await this.countRows(file.buffer, file.originalname);
    console.log('[StartMCQImportUseCase] Row count:', { rowCount });

    if (rowCount === 0) {
      console.error('[StartMCQImportUseCase] File is empty');
      throw new ValidationError('The uploaded file is empty or contains no data');
    }

    // 5. Upload File to S3
    const key = `mcq-imports/${templateId}/${Date.now()}-${file.originalname}`;
    console.log('[StartMCQImportUseCase] Uploading file to S3:', { key, size: file.size });
    
    try {
      const filePath = await this.storageService.uploadFile(file.buffer, key, file.mimetype);
      console.log('[StartMCQImportUseCase] File uploaded successfully to S3:', { filePath });

      // 6. Create Pending Import Job Record
      console.log('[StartMCQImportUseCase] Creating job record in database');
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
      console.log('[StartMCQImportUseCase] Job record created:', { jobId: createdJob.id });

      // 7. Queue the Job
      console.log('[StartMCQImportUseCase] Adding job to queue:', { jobId: createdJob.id });
      await this.jobQueueService.addJob(JobQueueName.MCQ_IMPORT, {
        jobId: createdJob.id,
        filePath: createdJob.filePath,
        templateId: createdJob.templateId,
      });
      console.log('[StartMCQImportUseCase] Job queued successfully');

      return {
        jobId: createdJob.id,
        fileName: createdJob.fileName,
        status: 'PENDING',
        message: 'Import job initiated. Check status endpoint for progress.',
      };
    } catch (error: any) {
      console.error('[StartMCQImportUseCase] Error uploading file to S3:', {
        message: error.message,
        stack: error.stack,
        key
      });
      throw error;
    }
  }
  
   private async countRows(buffer: Buffer, fileName: string): Promise<number> {
    if(fileName.endsWith('xlsx') || fileName.endsWith('.xls')){

      const workbook = XLSX.read(buffer, {type: 'buffer'});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1: A1')

      const count = range.e.r - range.s.r;
      return count> 0? count: 0
    }else {
      return new Promise((resolve, reject)=> {
        let count=0
        const stream = Readable.from(buffer);
        stream

        .pipe(csv())
        .on('data',()=> count++)
        .on('end',()=>resolve(count))
        .on('error', (err)=> reject(new ValidationError('Faailed to parse CSV file: ' + err.message)))

      })
    }
  }
}
   