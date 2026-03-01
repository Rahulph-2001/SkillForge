import { ContainerModule, type interfaces } from 'inversify';
import { TYPES } from '../types';
import { ProjectPaymentRequestRepository } from '../../database/repositories/ProjectPaymentRequestRepository';
import { type IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { DebitAdminWalletUseCase } from '../../../application/useCases/admin/DebitAdminWalletUseCase';
import { type IDebitAdminWalletUseCase } from '../../../application/useCases/admin/interfaces/IDebitAdminWalletUseCase';
import { ProcessProjectPaymentRequestUseCase } from '../../../application/useCases/admin/ProcessProjectPaymentRequestUseCase';
import { type IProcessProjectPaymentRequestUseCase } from '../../../application/useCases/admin/interfaces/IProcessProjectPaymentRequestUseCase';
import { GetPendingPaymentRequestsUseCase } from '../../../application/useCases/admin/GetPendingPaymentRequestsUseCase';
import { type IGetPendingPaymentRequestsUseCase } from '../../../application/useCases/admin/interfaces/IGetPendingPaymentRequestsUseCase';
import { ProjectPaymentRequestController } from '../../../presentation/controllers/admin/ProjectPaymentRequestController';

export const projectPaymentRequestBindings = new ContainerModule((bind: interfaces.Bind) => {
    // Repositories
    bind<IProjectPaymentRequestRepository>(TYPES.IProjectPaymentRequestRepository).to(ProjectPaymentRequestRepository).inSingletonScope();

    // Use Cases
    bind<IDebitAdminWalletUseCase>(TYPES.IDebitAdminWalletUseCase).to(DebitAdminWalletUseCase).inTransientScope();
    bind<IProcessProjectPaymentRequestUseCase>(TYPES.IProcessProjectPaymentRequestUseCase).to(ProcessProjectPaymentRequestUseCase).inTransientScope();
    bind<IGetPendingPaymentRequestsUseCase>(TYPES.IGetPendingPaymentRequestsUseCase).to(GetPendingPaymentRequestsUseCase).inTransientScope();

    // Controllers
    bind<ProjectPaymentRequestController>(TYPES.ProjectPaymentRequestController).to(ProjectPaymentRequestController).inTransientScope();
});
