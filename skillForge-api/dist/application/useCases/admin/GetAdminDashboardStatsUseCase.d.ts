import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IReportRepository } from '../../../domain/repositories/IReportRepository';
import { IGetAdminDashboardStatsUseCase } from './interfaces/IGetAdminDashboardStatsUseCase';
import { AdminDashboardStatsResponseDTO } from '../../dto/admin/GetAdminDashboardStatsDTO';
export declare class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
    private readonly userRepository;
    private readonly skillRepository;
    private readonly bookingRepository;
    private readonly paymentRepository;
    private readonly transactionRepository;
    private readonly reportRepository;
    constructor(userRepository: IUserRepository, skillRepository: ISkillRepository, bookingRepository: IBookingRepository, paymentRepository: IPaymentRepository, transactionRepository: IUserWalletTransactionRepository, reportRepository: IReportRepository);
    execute(adminUserId: string): Promise<AdminDashboardStatsResponseDTO>;
}
//# sourceMappingURL=GetAdminDashboardStatsUseCase.d.ts.map