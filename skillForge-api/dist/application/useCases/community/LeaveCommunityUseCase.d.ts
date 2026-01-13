import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { Database } from '../../../infrastructure/database/Database';
import { ILeaveCommunityUseCase } from './interfaces/ILeaveCommunityUseCase';
export declare class LeaveCommunityUseCase implements ILeaveCommunityUseCase {
    private readonly communityRepository;
    private readonly webSocketService;
    private readonly database;
    constructor(communityRepository: ICommunityRepository, webSocketService: IWebSocketService, database: Database);
    execute(userId: string, communityId: string): Promise<void>;
}
//# sourceMappingURL=LeaveCommunityUseCase.d.ts.map