import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { PrismaClient } from '@prisma/client';
export interface ILeaveCommunityUseCase {
    execute(userId: string, communityId: string): Promise<void>;
}
export declare class LeaveCommunityUseCase implements ILeaveCommunityUseCase {
    private readonly communityRepository;
    private readonly webSocketService;
    private readonly prisma;
    constructor(communityRepository: ICommunityRepository, webSocketService: IWebSocketService, prisma: PrismaClient);
    execute(userId: string, communityId: string): Promise<void>;
}
//# sourceMappingURL=LeaveCommunityUseCase.d.ts.map