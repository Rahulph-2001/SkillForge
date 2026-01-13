import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { IStartMCQImportUseCase } from '../../../application/useCases/mcq/interfaces/IStartMCQImportUseCase';
import { IListMCQImportJobsUseCase } from '../../../application/useCases/mcq/interfaces/IListMCQImportJobsUseCase';
import { IDownloadMCQImportErrorsUseCase } from '../../../application/useCases/mcq/interfaces/IDownloadMCQImportErrorsUseCase';
import { ValidationError } from '../../../domain/errors/AppError';

@injectable()
export class MCQImportController {
  constructor(
    @inject(TYPES.IStartMCQImportUseCase) private startImportUseCase: IStartMCQImportUseCase,
    @inject(TYPES.IListMCQImportJobsUseCase) private listJobsUseCase: IListMCQImportJobsUseCase,
    @inject(TYPES.IDownloadMCQImportErrorsUseCase) private downloadErrorsUseCase: IDownloadMCQImportErrorsUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder,
  ) { }

  /**
   * POST /api/v1/admin/mcq/import/:templateId
   * Starts the bulk import process via a worker queue
   */
  public startImport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.user!.userId;
      const { templateId } = req.params;
      const file = req.file;

      if (!file) {
        throw new ValidationError('CSV file is required for import');
      }

      const result = await this.startImportUseCase.execute({
        templateId,
        adminId,
        fileName: file.originalname,
        filePath: '' // Will be set by the use case after upload
      }, file);

      const response = this.responseBuilder.success(
        result,
        result.message,
        HttpStatusCode.ACCEPTED
      );

      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/admin/mcq/import/:templateId/status
   * Lists all import jobs for a specific template
   */
  public listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.user!.userId;
      const { templateId } = req.params;

      const result = await this.listJobsUseCase.execute(templateId, adminId);

      const response = this.responseBuilder.success(
        result,
        `Found ${result.jobs.length} import jobs for template ${templateId}`,
        HttpStatusCode.OK
      );

      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/admin/mcq/import/errors/:jobId/download
   * Downloads the CSV error file for a failed job
   */
  public downloadErrors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.user!.userId;
      const { jobId } = req.params;

      const { fileStream, fileName, mimeType } = await this.downloadErrorsUseCase.execute(jobId, adminId);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      fileStream.pipe(res);

    } catch (error) {
      next(error);
    }
  };
}