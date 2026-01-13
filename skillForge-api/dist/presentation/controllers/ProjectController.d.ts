import { Request, Response, NextFunction } from 'express';
import { ICreateProjectUseCase } from '../../application/useCases/project/interfaces/ICreateProjectUseCase';
import { IListProjectsUseCase } from '../../application/useCases/project/interfaces/IListProjectsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
export declare class ProjectController {
    private createProjectUseCase;
    private listProjectsUseCase;
    private responseBuilder;
    constructor(createProjectUseCase: ICreateProjectUseCase, listProjectsUseCase: IListProjectsUseCase, responseBuilder: IResponseBuilder);
    listProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ProjectController.d.ts.map