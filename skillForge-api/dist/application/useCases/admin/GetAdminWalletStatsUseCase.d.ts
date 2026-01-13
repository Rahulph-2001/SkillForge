import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IGetAdminWalletStatsUseCase } from './interfaces/IGetAdminWalletStatsUseCase';
import { GetAdminWalletStatsResponseDTO } from '../../dto/admin/GetAdminWalletStatsDTO';
export declare class GetAdminWalletStatsUseCase implements IGetAdminWalletStatsUseCase {
    private readonly userRepository;
    private readonly paymentRepository;
    private readonly projectRepository;
    private readonly paginationService;
    constructor(userRepository: IUserRepository, paymentRepository: IPaymentRepository, projectRepository: IProjectRepository, paginationService: IPaginationService);
    execute(): Promise<GetAdminWalletStatsResponseDTO>;
}
//# sourceMappingURL=GetAdminWalletStatsUseCase.d.ts.map