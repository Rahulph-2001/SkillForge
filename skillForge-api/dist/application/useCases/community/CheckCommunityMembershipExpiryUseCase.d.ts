import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { ITransactionService } from '../../../domain/services/ITransactionService';
import { ICheckCommunityMembershipExpiryUseCase } from './interfaces/ICheckCommunityMembershipExpiryUseCase';
export declare class CheckCommunityMembershipExpiryUseCase implements ICheckCommunityMembershipExpiryUseCase {
    private readonly communityRepository;
    private readonly webSocketService;
    private readonly transactionService;
    constructor(communityRepository: ICommunityRepository, webSocketService: IWebSocketService, transactionService: ITransactionService);
    execute(): Promise<void>;
}
//# sourceMappingURL=CheckCommunityMembershipExpiryUseCase.d.ts.map