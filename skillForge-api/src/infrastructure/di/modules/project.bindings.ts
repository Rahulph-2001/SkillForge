import { Container } from 'inversify';
import { TYPES } from '../types';
import { CreateProjectUseCase } from '../../../application/useCases/project/CreateProjectUseCase';
import { ICreateProjectUseCase } from '../../../application/useCases/project/interfaces/ICreateProjectUseCase';
import { ListProjectsUseCase } from '../../../application/useCases/project/ListProjectsUseCase';
import { IListProjectsUseCase } from '../../../application/useCases/project/interfaces/IListProjectsUseCase';
import { ProjectController } from '../../../presentation/controllers/ProjectController';
import { ProjectRoutes } from '../../../presentation/routes/project/projectRoutes';
import { ValidateProjectPostLimitUseCase } from '../../../application/useCases/project/ValidateProjectPostLimitUseCase';
import { IValidateProjectPostLimitUseCase } from '../../../application/useCases/project/interfaces/IValidateProjectPostLimitUseCase';
import { IncrementProjectPostUsageUseCase } from '../../../application/useCases/project/IncrementProjectPostUsageUseCase';
import { IIncrementProjectPostUsageUseCase } from '../../../application/useCases/project/interfaces/IIncrementProjectPostUsageUseCase';
import { GetProjectUseCase } from '../../../application/useCases/project/GetProjectUseCase';
import { IGetProjectUseCase } from '../../../application/useCases/project/interfaces/IGetProjectUseCase';
import { GetMyProjectsUseCase } from '../../../application/useCases/project/GetMyProjectsUseCase';
import { GetContributingProjectsUseCase } from '../../../application/useCases/project/GetContributingProjectsUseCase';
import { RequestProjectCompletionUseCase } from '../../../application/useCases/project/RequestProjectCompletionUseCase';
import { ReviewProjectCompletionUseCase } from '../../../application/useCases/project/ReviewProjectCompletionUseCase';

export const bindProjectModule = (container: Container): void => {
    // Project Use Cases
    container.bind<ICreateProjectUseCase>(TYPES.ICreateProjectUseCase).to(CreateProjectUseCase);
    container.bind<IListProjectsUseCase>(TYPES.IListProjectsUseCase).to(ListProjectsUseCase);
    container.bind<IValidateProjectPostLimitUseCase>(TYPES.IValidateProjectPostLimitUseCase).to(ValidateProjectPostLimitUseCase);
    container.bind<IIncrementProjectPostUsageUseCase>(TYPES.IIncrementProjectPostUsageUseCase).to(IncrementProjectPostUsageUseCase);
    container.bind<IGetProjectUseCase>(TYPES.IGetProjectUseCase).to(GetProjectUseCase);
    container.bind<GetMyProjectsUseCase>(TYPES.GetMyProjectsUseCase).to(GetMyProjectsUseCase);
    container.bind<GetContributingProjectsUseCase>(TYPES.GetContributingProjectsUseCase).to(GetContributingProjectsUseCase);
    container.bind<RequestProjectCompletionUseCase>(TYPES.RequestProjectCompletionUseCase).to(RequestProjectCompletionUseCase);
    container.bind<ReviewProjectCompletionUseCase>(TYPES.ReviewProjectCompletionUseCase).to(ReviewProjectCompletionUseCase);

    // Controllers & Routes
    container.bind<ProjectController>(TYPES.ProjectController).to(ProjectController);
    container.bind<ProjectRoutes>(TYPES.ProjectRoutes).to(ProjectRoutes);
};
