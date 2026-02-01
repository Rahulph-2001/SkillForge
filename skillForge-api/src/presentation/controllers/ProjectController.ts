import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { ICreateProjectUseCase } from '../../application/useCases/project/interfaces/ICreateProjectUseCase';
import { IListProjectsUseCase } from '../../application/useCases/project/interfaces/IListProjectsUseCase';
import { IGetProjectUseCase } from '../../application/useCases/project/interfaces/IGetProjectUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { CreateProjectRequestDTO } from '../../application/dto/project/CreateProjectDTO';
import { ListProjectsRequestDTO } from '../../application/dto/project/ListProjectsDTO';
import { GetMyProjectsUseCase } from '../../application/useCases/project/GetMyProjectsUseCase';
import { GetContributingProjectsUseCase } from '../../application/useCases/project/GetContributingProjectsUseCase';
import { RequestProjectCompletionUseCase } from '../../application/useCases/project/RequestProjectCompletionUseCase';
import { ReviewProjectCompletionUseCase } from '../../application/useCases/project/ReviewProjectCompletionUseCase';

@injectable()
export class ProjectController {
  constructor(
    @inject(TYPES.ICreateProjectUseCase) private createProjectUseCase: ICreateProjectUseCase,
    @inject(TYPES.IListProjectsUseCase) private listProjectsUseCase: IListProjectsUseCase,
    @inject(TYPES.IGetProjectUseCase) private getProjectUseCase: IGetProjectUseCase,
    @inject(TYPES.GetMyProjectsUseCase) private getMyProjectsUseCase: GetMyProjectsUseCase,
    @inject(TYPES.GetContributingProjectsUseCase) private readonly getContributingProjectsUseCase: GetContributingProjectsUseCase,
    @inject(TYPES.RequestProjectCompletionUseCase) private readonly requestProjectCompletionUseCase: RequestProjectCompletionUseCase,
    @inject(TYPES.ReviewProjectCompletionUseCase) private readonly reviewProjectCompletionUseCase: ReviewProjectCompletionUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) { }

  public listProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: ListProjectsRequestDTO = {
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        status: req.query.status as 'Open' | 'In_Progress' | 'Completed' | 'Cancelled' | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const result = await this.listProjectsUseCase.execute(filters);

      const response = this.responseBuilder.success(result, 'Projects fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };

  public getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const project = await this.getProjectUseCase.execute(id);

      const response = this.responseBuilder.success(project, 'Project details fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };

  public getMyProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Assuming Request is extended with user, usually req.user.id
      const userId = (req as any).user.id;
      const projects = await this.getMyProjectsUseCase.execute(userId);

      const response = this.responseBuilder.success(projects, 'My projects fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };

  public getContributingProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const projects = await this.getContributingProjectsUseCase.execute(userId);

      const response = this.responseBuilder.success(projects, 'Contributing projects fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };

  public requestCompletion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      await this.requestProjectCompletionUseCase.execute(id, userId);

      const response = this.responseBuilder.success(null, 'Project completion requested successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };

  public reviewCompletion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { decision } = req.body;
      const userId = (req as any).user.id;

      await this.reviewProjectCompletionUseCase.execute(id, userId, decision);

      const response = this.responseBuilder.success(null, 'Project review submitted successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };
}

