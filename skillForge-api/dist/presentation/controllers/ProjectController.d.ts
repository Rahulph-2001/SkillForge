import { Request, Response, NextFunction } from 'express';
import { ICreateProjectUseCase } from '../../application/useCases/project/interfaces/ICreateProjectUseCase';
import { IListProjectsUseCase } from '../../application/useCases/project/interfaces/IListProjectsUseCase';
import { IGetProjectUseCase } from '../../application/useCases/project/interfaces/IGetProjectUseCase';
import { IGetMyProjectsUseCase } from '../../application/useCases/project/interfaces/IGetMyProjectsUseCase';
import { IGetContributingProjectsUseCase } from '../../application/useCases/project/interfaces/IGetContributingProjectsUseCase';
import { IRequestProjectCompletionUseCase } from '../../application/useCases/project/interfaces/IRequestProjectCompletionUseCase';
import { IReviewProjectCompletionUseCase } from '../../application/useCases/project/interfaces/IReviewProjectCompletionUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
export declare class ProjectController {
    private createProjectUseCase;
    private listProjectsUseCase;
    private getProjectUseCase;
    private getMyProjectsUseCase;
    private readonly getContributingProjectsUseCase;
    private readonly requestProjectCompletionUseCase;
    private readonly reviewProjectCompletionUseCase;
    private responseBuilder;
    constructor(createProjectUseCase: ICreateProjectUseCase, listProjectsUseCase: IListProjectsUseCase, getProjectUseCase: IGetProjectUseCase, getMyProjectsUseCase: IGetMyProjectsUseCase, getContributingProjectsUseCase: IGetContributingProjectsUseCase, requestProjectCompletionUseCase: IRequestProjectCompletionUseCase, reviewProjectCompletionUseCase: IReviewProjectCompletionUseCase, responseBuilder: IResponseBuilder);
    listProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getContributingProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    requestCompletion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    reviewCompletion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ProjectController.d.ts.map