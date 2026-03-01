import { type Container } from 'inversify';
import { TYPES } from '../types';

// Use Cases
import { ApplyToProjectUseCase } from '../../../application/useCases/projectApplication/ApplyToProjectUseCase';
import { type IApplyToProjectUseCase } from '../../../application/useCases/projectApplication/interfaces/IApplyToProjectUseCase';
import { GetProjectApplicationsUseCase } from '../../../application/useCases/projectApplication/GetProjectApplicationsUseCase';
import { type IGetProjectApplicationsUseCase } from '../../../application/useCases/projectApplication/interfaces/IGetProjectApplicationsUseCase';
import { UpdateApplicationStatusUseCase } from '../../../application/useCases/projectApplication/UpdateApplicationStatusUseCase';
import { type IUpdateApplicationStatusUseCase } from '../../../application/useCases/projectApplication/interfaces/IUpdateApplicationStatusUseCase';
import { GetMyApplicationsUseCase } from '../../../application/useCases/projectApplication/GetMyApplicationsUseCase';
import { type IGetMyApplicationsUseCase } from '../../../application/useCases/projectApplication/interfaces/IGetMyApplicationsUseCase';
import { WithdrawApplicationUseCase } from '../../../application/useCases/projectApplication/WithdrawApplicationUseCase';
import { type IWithdrawApplicationUseCase } from '../../../application/useCases/projectApplication/interfaces/IWithdrawApplicationUseCase';
import { GetReceivedApplicationsUseCase } from '../../../application/useCases/projectApplication/GetReceivedApplicationsUseCase';

// Controllers
import { ProjectApplicationController } from '../../../presentation/controllers/projectApplication/ProjectApplicationController';

// Routes
import { ProjectApplicationRoutes } from '../../../presentation/routes/projectApplication/ProjectApplicationRoutes';

// Repository
import { type IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { ProjectApplicationRepository } from '../../database/repositories/ProjectApplicationRepository';

// Mapper
import { type IProjectApplicationMapper } from '../../../application/mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationMapper } from '../../../application/mappers/ProjectApplicationMapper';

// Services
import { type IGeminiAIService } from '../../../domain/services/IGeminiAIService';
import { GeminiAIService } from '../../services/GeminiAIService';

export function registerProjectApplicationBindings(container: Container) {
  // Use Cases
  container.bind<IApplyToProjectUseCase>(TYPES.IApplyToProjectUseCase).to(ApplyToProjectUseCase);
  container.bind<IGetProjectApplicationsUseCase>(TYPES.IGetProjectApplicationsUseCase).to(GetProjectApplicationsUseCase);
  container.bind<IUpdateApplicationStatusUseCase>(TYPES.IUpdateApplicationStatusUseCase).to(UpdateApplicationStatusUseCase);
  container.bind<IGetMyApplicationsUseCase>(TYPES.IGetMyApplicationsUseCase).to(GetMyApplicationsUseCase);
  container.bind<IWithdrawApplicationUseCase>(TYPES.IWithdrawApplicationUseCase).to(WithdrawApplicationUseCase);
  container.bind<GetReceivedApplicationsUseCase>(TYPES.GetReceivedApplicationsUseCase).to(GetReceivedApplicationsUseCase);

  // Controller
  container.bind<ProjectApplicationController>(TYPES.ProjectApplicationController).to(ProjectApplicationController);

  // Repository
  container.bind<IProjectApplicationRepository>(TYPES.IProjectApplicationRepository).to(ProjectApplicationRepository);

  // Mapper
  container.bind<IProjectApplicationMapper>(TYPES.IProjectApplicationMapper).to(ProjectApplicationMapper);

  // Services
  container.bind<IGeminiAIService>(TYPES.IGeminiAIService).to(GeminiAIService);

  // Routes
  container.bind<ProjectApplicationRoutes>(TYPES.ProjectApplicationRoutes).to(ProjectApplicationRoutes);
}