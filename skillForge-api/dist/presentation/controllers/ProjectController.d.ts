import { Request, Response, NextFunction } from 'express';
import { ICreateProjectUseCase } from '../../application/useCases/project/interfaces/ICreateProjectUseCase';
import { IListProjectsUseCase } from '../../application/useCases/project/interfaces/IListProjectsUseCase';
import { IGetProjectUseCase } from '../../application/useCases/project/interfaces/IGetProjectUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { GetMyProjectsUseCase } from '../../application/useCases/project/GetMyProjectsUseCase';
import { GetContributingProjectsUseCase } from '../../application/useCases/project/GetContributingProjectsUseCase';
import { IRequestProjectCompletionUseCase } from '../../application/useCases/project/interfaces/IRequestProjectCompletionUseCase';
import { IReviewProjectCompletionUseCase } from '../../application/useCases/project/interfaces/IReviewProjectCompletionUseCase';
export declare class ProjectController {
    private createProjectUseCase;
    private listProjectsUseCase;
    private getProjectUseCase;
    private getMyProjectsUseCase;
    private readonly getContributingProjectsUseCase;
    private readonly requestProjectCompletionUseCase;
    private readonly reviewProjectCompletionUseCase;
    private responseBuilder;
    constructor(createProjectUseCase: ICreateProjectUseCase, listProjectsUseCase: IListProjectsUseCase, getProjectUseCase: IGetProjectUseCase, getMyProjectsUseCase: GetMyProjectsUseCase, getContributingProjectsUseCase: GetContributingProjectsUseCase, requestProjectCompletionUseCase: IRequestProjectCompletionUseCase, reviewProjectCompletionUseCase: IReviewProjectCompletionUseCase, responseBuilder: IResponseBuilder);
    listProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getContributingProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    requestCompletion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    reviewCompletion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ProjectController.d.ts.map