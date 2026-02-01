import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IApproveProjectCompletionUseCase } from './interfaces/IApproveProjectCompletionUseCase';
export declare class ApproveProjectCompletionUseCase implements IApproveProjectCompletionUseCase {
    private readonly projectRepository;
    private readonly paymentRepository;
    constructor(projectRepository: IProjectRepository, paymentRepository: IPaymentRepository);
    execute(projectId: string, clientId: string): Promise<void>;
}
//# sourceMappingURL=ApproveProjectCompletionUseCase.d.ts.map