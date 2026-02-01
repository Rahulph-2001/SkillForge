import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IApplyToProjectUseCase } from '../../../application/useCases/projectApplication/interfaces/IApplyToProjectUseCase';
import { IGetProjectApplicationsUseCase } from '../../../application/useCases/projectApplication/interfaces/IGetProjectApplicationsUseCase';
import { IUpdateApplicationStatusUseCase } from '../../../application/useCases/projectApplication/interfaces/IUpdateApplicationStatusUseCase';
import { IGetMyApplicationsUseCase } from '../../../application/useCases/projectApplication/interfaces/IGetMyApplicationsUseCase';
import { IWithdrawApplicationUseCase } from '../../../application/useCases/projectApplication/interfaces/IWithdrawApplicationUseCase';
import { GetReceivedApplicationsUseCase } from '../../../application/useCases/projectApplication/GetReceivedApplicationsUseCase';
import { CreateProjectApplicationSchema } from '../../../application/dto/projectApplication/CreateProjectApplicationDTO';
import { UpdateApplicationStatusSchema } from '../../../application/dto/projectApplication/UpdateApplicationStatusDTO';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { ValidationError } from '../../../domain/errors/AppError';
import { ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';

@injectable()
export class ProjectApplicationController {
  constructor(
    @inject(TYPES.IApplyToProjectUseCase) private readonly applyToProjectUseCase: IApplyToProjectUseCase,
    @inject(TYPES.IGetProjectApplicationsUseCase) private readonly getProjectApplicationsUseCase: IGetProjectApplicationsUseCase,
    @inject(TYPES.IUpdateApplicationStatusUseCase) private readonly updateStatusUseCase: IUpdateApplicationStatusUseCase,
    @inject(TYPES.IGetMyApplicationsUseCase) private readonly getMyApplicationsUseCase: IGetMyApplicationsUseCase,
    @inject(TYPES.IWithdrawApplicationUseCase) private readonly withdrawApplicationUseCase: IWithdrawApplicationUseCase,
    @inject(TYPES.GetReceivedApplicationsUseCase) private readonly getReceivedApplicationsUseCase: GetReceivedApplicationsUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  async applyToProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const applicantId = req.user!.userId;

      const validationResult = CreateProjectApplicationSchema.safeParse({ ...req.body, projectId });
      if (!validationResult.success) {
        throw new ValidationError(validationResult.error.message);
      }

      const application = await this.applyToProjectUseCase.execute(applicantId, validationResult.data);

      const response = this.responseBuilder.success(application, SUCCESS_MESSAGES.PROJECT_APPLICATION.SUBMITTED, HttpStatusCode.CREATED);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async getProjectApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user!.userId;

      const applications = await this.getProjectApplicationsUseCase.execute(projectId, userId);

      const response = this.responseBuilder.success(applications, SUCCESS_MESSAGES.PROJECT_APPLICATION.FETCHED);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { applicationId } = req.params;
      const clientId = req.user!.userId;

      const validationResult = UpdateApplicationStatusSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new ValidationError(validationResult.error.message);
      }

      // Cast status to ProjectApplicationStatus enum
      const status = validationResult.data.status as ProjectApplicationStatus;

      const application = await this.updateStatusUseCase.execute(applicationId, clientId, status);

      const response = this.responseBuilder.success(application, SUCCESS_MESSAGES.PROJECT_APPLICATION.UPDATED);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applicantId = req.user!.userId;

      const applications = await this.getMyApplicationsUseCase.execute(applicantId);

      const response = this.responseBuilder.success(applications, SUCCESS_MESSAGES.PROJECT_APPLICATION.FETCHED);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async withdrawApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { applicationId } = req.params;
      const applicantId = req.user!.userId;

      const application = await this.withdrawApplicationUseCase.execute(applicationId, applicantId);

      const response = this.responseBuilder.success(application, SUCCESS_MESSAGES.PROJECT_APPLICATION.WITHDRAWN);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async getReceivedApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const applications = await this.getReceivedApplicationsUseCase.execute(userId);

      const response = this.responseBuilder.success(applications, SUCCESS_MESSAGES.PROJECT_APPLICATION.FETCHED);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}