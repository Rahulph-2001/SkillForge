import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IGetWalletTransactionsUseCase } from './interfaces/IGetWalletTransactionsUseCase';
import { GetWalletTransactionsResponseDTO } from '../../dto/admin/GetWalletTransactionsDTO';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
    private readonly paymentRepository;
    private readonly userRepository;
    private readonly paginationService;
    constructor(paymentRepository: IPaymentRepository, userRepository: IUserRepository, paginationService: IPaginationService);
    execute(page: number, limit: number, search?: string, type?: 'CREDIT' | 'WITHDRAWAL', status?: 'COMPLETED' | 'PENDING' | 'FAILED'): Promise<GetWalletTransactionsResponseDTO>;
    private mapStatusToPaymentStatus;
    private mapPaymentStatusToStatus;
}
//# sourceMappingURL=GetWalletTransactionsUseCase.d.ts.map