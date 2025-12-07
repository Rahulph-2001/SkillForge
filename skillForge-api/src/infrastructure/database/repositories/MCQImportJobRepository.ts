import { injectable, inject } from 'inversify';
import { PrismaClient, McqImportJob as ORMMcqImportJob } from '@prisma/client';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { MCQImportJob, ImportStatus } from '../../../domain/entities/MCQImportJob';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class MCQImportJobRepository implements IMCQImportJobRepository {
  private prisma: PrismaClient;

  constructor(@inject(TYPES.Database) db: Database) {
    this.prisma = db.getClient();
  }

  private toDomain(orm: ORMMcqImportJob): MCQImportJob {
    return new MCQImportJob({
      id: orm.id,
      templateId: orm.templateId,
      adminId: orm.adminId,
      fileName: orm.fileName,
      filePath: orm.filePath,
      status: orm.status as ImportStatus,
      totalRows: orm.totalRows,
      processedRows: orm.processedRows,
      successfulRows: orm.successfulRows,
      failedRows: orm.failedRows,
      errorFilePath: orm.errorFilePath,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      startedAt: orm.startedAt,
      completedAt: orm.completedAt,
    });
  }

  private toPersistence(domain: MCQImportJob) {
    return {
      id: domain.id,
      templateId: domain.templateId,
      adminId: domain.adminId,
      fileName: domain.fileName,
      filePath: domain.filePath,
      status: domain.status,
      totalRows: domain.totalRows,
      processedRows: domain.processedRows,
      successfulRows: domain.successfulRows,
      failedRows: domain.failedRows,
      errorFilePath: domain.errorFilePath,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      startedAt: domain.startedAt,
      completedAt: domain.completedAt,
    };
  }

  async create(job: MCQImportJob): Promise<MCQImportJob> {
    const created = await this.prisma.mcqImportJob.create({
      data: this.toPersistence(job),
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<MCQImportJob | null> {
    const job = await this.prisma.mcqImportJob.findUnique({
      where: { id },
    });
    return job ? this.toDomain(job) : null;
  }

  async findByTemplateId(templateId: string): Promise<MCQImportJob[]> {
    const jobs = await this.prisma.mcqImportJob.findMany({
      where: { templateId },
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map(this.toDomain);
  }

  async update(job: MCQImportJob): Promise<MCQImportJob> {
    try {
      const updated = await this.prisma.mcqImportJob.update({
        where: { id: job.id },
        data: this.toPersistence(job),
      });
      return this.toDomain(updated);
    } catch (error) {
      throw new NotFoundError('MCQ Import Job not found for update');
    }
  }

  async updateProgress(
    jobId: string,
    status: ImportStatus,
    processedRows: number,
    successfulRows: number,
    failedRows: number,
    errorFilePath: string | null,
    startedAt?: Date,
    completedAt?: Date,
  ): Promise<MCQImportJob> {
    const updateData: any = {
      status,
      processedRows,
      successfulRows,
      failedRows,
      errorFilePath,
      updatedAt: new Date(),
    };
    if (startedAt) updateData.startedAt = startedAt;
    if (completedAt) updateData.completedAt = completedAt;

    try {
      const updated = await this.prisma.mcqImportJob.update({
        where: { id: jobId },
        data: updateData,
      });
      return this.toDomain(updated);
    } catch (error) {
      throw new NotFoundError('MCQ Import Job not found for progress update');
    }
  }
}