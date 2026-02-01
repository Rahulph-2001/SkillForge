import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { ITransactionService } from '../../../domain/services/ITransactionService';
import { IProcessAutoRenewMembershipsUseCase } from './interfaces/IProcessAutoRenewMembershipsUseCase';
export declare class ProcessAutoRenewMembershipsUseCase implements IProcessAutoRenewMembershipsUseCase {
    private readonly communityRepository;
    private readonly userRepository;
    private readonly webSocketService;
    private readonly transactionService;
    constructor(communityRepository: ICommunityRepository, userRepository: IUserRepository, webSocketService: IWebSocketService, transactionService: ITransactionService);
    execute(): Promise<void>;
    private processSuccessfulRenewal;
    private processFailedRenewal;
}
//# sourceMappingURL=ProcessAutoRenewMembershipsUseCase.d.ts.map