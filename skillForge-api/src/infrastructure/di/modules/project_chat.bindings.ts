
import { ContainerModule, interfaces } from 'inversify';
import { TYPES } from '../types';
import { IProjectMessageRepository } from '../../../domain/repositories/IProjectMessageRepository';
import { ProjectMessageRepository } from '../../database/repositories/ProjectMessageRepository';
import { IProjectMessageMapper } from '../../../application/mappers/interfaces/IProjectMessageMapper';
import { ProjectMessageMapper } from '../../../application/mappers/ProjectMessageMapper';
import { ISendProjectMessageUseCase } from '../../../application/useCases/project/interfaces/ISendProjectMessageUseCase';
import { SendProjectMessageUseCase } from '../../../application/useCases/project/SendProjectMessageUseCase';
import { IGetProjectMessagesUseCase } from '../../../application/useCases/project/interfaces/IGetProjectMessagesUseCase';
import { GetProjectMessagesUseCase } from '../../../application/useCases/project/GetProjectMessagesUseCase';
import { ProjectMessageController } from '../../../presentation/controllers/project/ProjectMessageController';
import { ProjectMessageRoutes } from '../../../presentation/routes/project/ProjectMessageRoutes';

export const projectChatBindings = new ContainerModule((bind: interfaces.Bind) => {
    // Repository
    bind<IProjectMessageRepository>(TYPES.IProjectMessageRepository).to(ProjectMessageRepository).inSingletonScope();

    // Mapper
    bind<IProjectMessageMapper>(TYPES.IProjectMessageMapper).to(ProjectMessageMapper).inSingletonScope();

    // Use Cases
    bind<ISendProjectMessageUseCase>(TYPES.ISendProjectMessageUseCase).to(SendProjectMessageUseCase).inTransientScope();
    bind<IGetProjectMessagesUseCase>(TYPES.IGetProjectMessagesUseCase).to(GetProjectMessagesUseCase).inTransientScope();

    // Controller
    bind<ProjectMessageController>(TYPES.ProjectMessageController).to(ProjectMessageController).inSingletonScope();

    // Routes
    bind<ProjectMessageRoutes>(TYPES.ProjectMessageRoutes).to(ProjectMessageRoutes).inSingletonScope();
});
