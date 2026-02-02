import { Container } from 'inversify';
import { TYPES } from '../types';
import { IReportRepository } from '../../../domain/repositories/IReportRepository';
import { PrismaReportRepository } from '../../../infrastructure/database/repositories/PrismaReportRepository';
import { AdminListReportsUseCase } from '../../../application/useCases/admin/AdminListReportsUseCase';
import { IAdminListReportsUseCase } from '../../../application/useCases/admin/interfaces/IAdminListReportsUseCase';
import { AdminManageReportUseCase } from '../../../application/useCases/admin/AdminManageReportUseCase';
import { IAdminManageReportUseCase } from '../../../application/useCases/admin/interfaces/IAdminManageReportUseCase';
import { CreateReportUseCase } from '../../../application/useCases/report/CreateReportUseCase';
import { ICreateReportUseCase } from '../../../application/useCases/report/interfaces/ICreateReportUseCase';
import { AdminReportController } from '../../../presentation/controllers/admin/AdminReportController';
import { ReportController } from '../../../presentation/controllers/ReportController';
import { AdminReportRoutes } from '../../../presentation/routes/admin/AdminReportRoutes';
import { ReportRoutes } from '../../../presentation/routes/ReportRoutes';

export const bindReportModule = (container: Container): void => {
    // Repositories
    container.bind<IReportRepository>(TYPES.IReportRepository).to(PrismaReportRepository);

    // Use Cases
    container.bind<IAdminListReportsUseCase>(TYPES.IAdminListReportsUseCase).to(AdminListReportsUseCase);
    container.bind<IAdminManageReportUseCase>(TYPES.IAdminManageReportUseCase).to(AdminManageReportUseCase);
    container.bind<ICreateReportUseCase>(TYPES.ICreateReportUseCase).to(CreateReportUseCase);

    // Controllers
    container.bind<AdminReportController>(TYPES.AdminReportController).to(AdminReportController);
    container.bind<ReportController>(TYPES.ReportController).to(ReportController);

    // Routes
    container.bind<AdminReportRoutes>(TYPES.AdminReportRoutes).to(AdminReportRoutes);
    container.bind<ReportRoutes>(TYPES.ReportRoutes).to(ReportRoutes);
};
