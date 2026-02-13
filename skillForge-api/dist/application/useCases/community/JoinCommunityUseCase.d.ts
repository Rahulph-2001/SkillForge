import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMemberResponseDTO } from '../../dto/community/CommunityMemberResponseDTO';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IJoinCommunityUseCase } from './interfaces/IJoinCommunityUseCase';
import { ITransactionService } from '../../../domain/services/ITransactionService';
export declare class JoinCommunityUseCase implements IJoinCommunityUseCase {
    private readonly communityRepository;
    private readonly userRepository;
    private readonly webSocketService;
    private readonly transactionService;
    private readonly userWalletTransactionRepository;
    constructor(communityRepository: ICommunityRepository, userRepository: IUserRepository, webSocketService: IWebSocketService, transactionService: ITransactionService, userWalletTransactionRepository: IUserWalletTransactionRepository);
    execute(userId: string, communityId: string): Promise<CommunityMemberResponseDTO>;
}
//# sourceMappingURL=JoinCommunityUseCase.d.ts.map