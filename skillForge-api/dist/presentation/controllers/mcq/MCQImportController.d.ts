import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { IStartMCQImportUseCase } from '../../../application/useCases/mcq/interfaces/IStartMCQImportUseCase';
import { IListMCQImportJobsUseCase } from '../../../application/useCases/mcq/interfaces/IListMCQImportJobsUseCase';
import { IDownloadMCQImportErrorsUseCase } from '../../../application/useCases/mcq/interfaces/IDownloadMCQImportErrorsUseCase';
export declare class MCQImportController {
    private startImportUseCase;
    private listJobsUseCase;
    private downloadErrorsUseCase;
    private responseBuilder;
    constructor(startImportUseCase: IStartMCQImportUseCase, listJobsUseCase: IListMCQImportJobsUseCase, downloadErrorsUseCase: IDownloadMCQImportErrorsUseCase, responseBuilder: IResponseBuilder);
    /**
     * POST /api/v1/admin/mcq/import/:templateId
     * Starts the bulk import process via a worker queue
     */
    startImport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /api/v1/admin/mcq/import/:templateId/status
     * Lists all import jobs for a specific template
     */
    listJobs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /api/v1/admin/mcq/import/errors/:jobId/download
     * Downloads the CSV error file for a failed job
     */
    downloadErrors: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=MCQImportController.d.ts.map