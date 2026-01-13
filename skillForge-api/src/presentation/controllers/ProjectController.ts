import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { ICreateProjectUseCase } from '../../application/useCases/project/interfaces/ICreateProjectUseCase';
import { IListProjectsUseCase } from '../../application/useCases/project/interfaces/IListProjectsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { CreateProjectRequestDTO } from '../../application/dto/project/CreateProjectDTO';
import { ListProjectsRequestDTO } from '../../application/dto/project/ListProjectsDTO';

@injectable()
export class ProjectController {
  constructor(
    @inject(TYPES.ICreateProjectUseCase) private createProjectUseCase: ICreateProjectUseCase,
    @inject(TYPES.IListProjectsUseCase) private listProjectsUseCase: IListProjectsUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}

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
}

