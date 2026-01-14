import { Container } from 'inversify';
import { TYPES } from '../types';
import { IAdminListSessionsUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminListSessionsUseCase';
import { AdminListSessionsUseCase } from '../../../application/useCases/admin/session/AdminListSessionsUseCase';
import { IAdminGetSessionStatsUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminGetSessionStatsUseCase';
import { AdminGetSessionStatsUseCase } from '../../../application/useCases/admin/session/AdminGetSessionStatsUseCase';
import { IAdminCancelSessionUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminCancelSessionUseCase';
import { AdminCancelSessionUseCase } from '../../../application/useCases/admin/session/AdminCancelSessionUseCase';
import { IAdminCompleteSessionUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminCompleteSessionUseCase';
import { AdminCompleteSessionUseCase } from '../../../application/useCases/admin/session/AdminCompleteSessionUseCase';
import { AdminSessionController } from '../../../presentation/controllers/admin/AdminSessionController';
import { AdminSessionRoutes } from '../../../presentation/routes/admin/adminSessionRoutes';

export const bindAdminSessionModule = (container: Container): void => {
    // Use Cases
    container.bind<IAdminListSessionsUseCase>(TYPES.IAdminListSessionsUseCase).to(AdminListSessionsUseCase);
    container.bind<IAdminGetSessionStatsUseCase>(TYPES.IAdminGetSessionStatsUseCase).to(AdminGetSessionStatsUseCase);
    container.bind<IAdminCancelSessionUseCase>(TYPES.IAdminCancelSessionUseCase).to(AdminCancelSessionUseCase);
    container.bind<IAdminCompleteSessionUseCase>(TYPES.IAdminCompleteSessionUseCase).to(AdminCompleteSessionUseCase);

    // Controller
    container.bind<AdminSessionController>(TYPES.AdminSessionController).to(AdminSessionController);

    // Routes
    container.bind<AdminSessionRoutes>(TYPES.AdminSessionRoutes).to(AdminSessionRoutes);
};
