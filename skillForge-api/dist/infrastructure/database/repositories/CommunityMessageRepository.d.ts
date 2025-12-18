import { PrismaClient } from '@prisma/client';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
export declare class CommunityMessageRepository implements ICommunityMessageRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(message: CommunityMessage): Promise<CommunityMessage>;
    findById(id: string): Promise<CommunityMessage | null>;
    findByCommunityId(communityId: string, limit?: number, offset?: number): Promise<CommunityMessage[]>;
    findPinnedMessages(communityId: string): Promise<CommunityMessage[]>;
    update(message: CommunityMessage): Promise<CommunityMessage>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=CommunityMessageRepository.d.ts.map