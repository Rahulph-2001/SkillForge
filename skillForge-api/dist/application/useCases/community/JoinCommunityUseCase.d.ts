import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { PrismaClient } from '@prisma/client';
export interface IJoinCommunityUseCase {
    execute(userId: string, communityId: string): Promise<CommunityMember>;
}
export declare class JoinCommunityUseCase implements IJoinCommunityUseCase {
    private readonly communityRepository;
    private readonly userRepository;
    private readonly webSocketService;
    private readonly prisma;
    constructor(communityRepository: ICommunityRepository, userRepository: IUserRepository, webSocketService: IWebSocketService, prisma: PrismaClient);
    execute(userId: string, communityId: string): Promise<CommunityMember>;
}
//# sourceMappingURL=JoinCommunityUseCase.d.ts.map