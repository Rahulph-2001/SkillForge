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

   
    const allowedMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if(!allowedMimes.includes(file.mimetype)){
      throw new ValidationError('Only CSV and Excel (.xlsx, .xls) files are supported')
    }
    // 4. Count Rows for Context (Pre-pass)
    const rowCount = await this.countRows(file.buffer, file.originalname);

    if (rowCount === 0) {
      throw new ValidationError('The uploaded  file is empty or contains no data');
    }

    // 5. Upload File to S3
    const key = `mcq-imports/${templateId}/${Date.now()}-${file.originalname}`;
    const filePath = await this.storageService.uploadFile(file.buffer, key, file.mimetype);

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
   