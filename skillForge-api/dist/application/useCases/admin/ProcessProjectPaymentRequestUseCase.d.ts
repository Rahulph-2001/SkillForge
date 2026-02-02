import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IDebitAdminWalletUseCase } from './interfaces/IDebitAdminWalletUseCase';
import { IProcessProjectPaymentRequestUseCase } from './interfaces/IProcessProjectPaymentRequestUseCase';
export declare class ProcessProjectPaymentRequestUseCase implements IProcessProjectPaymentRequestUseCase {
    private readonly paymentRequestRepository;
    private readonly projectRepository;
    private readonly userRepository;
    private readonly userWalletTransactionRepository;
    private readonly debitAdminWalletUseCase;
    constructor(paymentRequestRepository: IProjectPaymentRequestRepository, projectRepository: IProjectRepository, userRepository: IUserRepository, userWalletTransactionRepository: IUserWalletTransactionRepository, debitAdminWalletUseCase: IDebitAdminWalletUseCase);
    execute(requestId: string, adminId: string, approved: boolean, notes?: string): Promise<void>;
}
//# sourceMappingURL=ProcessProjectPaymentRequestUseCase.d.ts.map