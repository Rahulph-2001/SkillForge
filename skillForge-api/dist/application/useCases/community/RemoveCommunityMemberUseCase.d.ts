import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { Database } from '../../../infrastructure/database/Database';
import { IRemoveCommunityMemberUseCase } from './interfaces/IRemoveCommunityMemberUseCase';
export declare class RemoveCommunityMemberUseCase implements IRemoveCommunityMemberUseCase {
    private readonly communityRepository;
    private readonly userRepository;
    private readonly webSocketService;
    private readonly database;
    constructor(communityRepository: ICommunityRepository, userRepository: IUserRepository, webSocketService: IWebSocketService, database: Database);
    execute(adminId: string, communityId: string, memberId: string): Promise<void>;
}
//# sourceMappingURL=RemoveCommunityMemberUseCase.d.ts.map