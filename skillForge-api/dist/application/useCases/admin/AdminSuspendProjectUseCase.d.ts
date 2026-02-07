import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IDebitAdminWalletUseCase } from './interfaces/IDebitAdminWalletUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { IAdminSuspendProjectUseCase } from './interfaces/IAdminSuspendProjectUseCase';
import { AdminSuspendProjectRequestDTO, AdminSuspendProjectResponseDTO } from '../../dto/admin/AdminSuspendProjectDTO';
export declare class AdminSuspendProjectUseCase implements IAdminSuspendProjectUseCase {
    private readonly projectRepository;
    private readonly paymentRepository;
    private readonly userRepository;
    private readonly userWalletTransactionRepository;
    private readonly debitAdminWalletUseCase;
    private readonly notificationService;
    constructor(projectRepository: IProjectRepository, paymentRepository: IPaymentRepository, userRepository: IUserRepository, userWalletTransactionRepository: IUserWalletTransactionRepository, debitAdminWalletUseCase: IDebitAdminWalletUseCase, notificationService: INotificationService);
    execute(projectId: string, dto: AdminSuspendProjectRequestDTO, _adminId: string): Promise<AdminSuspendProjectResponseDTO>;
}
//# sourceMappingURL=AdminSuspendProjectUseCase.d.ts.map