import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMemberResponseDTO } from '../../dto/community/CommunityMemberResponseDTO';
import { IJoinCommunityUseCase } from './interfaces/IJoinCommunityUseCase';
import { ITransactionService } from '../../../domain/services/ITransactionService';
export declare class JoinCommunityUseCase implements IJoinCommunityUseCase {
    private readonly communityRepository;
    private readonly userRepository;
    private readonly webSocketService;
    private readonly transactionService;
    constructor(communityRepository: ICommunityRepository, userRepository: IUserRepository, webSocketService: IWebSocketService, transactionService: ITransactionService);
    execute(userId: string, communityId: string): Promise<CommunityMemberResponseDTO>;
}
//# sourceMappingURL=JoinCommunityUseCase.d.ts.map