import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class CommunityMessageRepository extends BaseRepository<CommunityMessage> implements ICommunityMessageRepository {
    constructor(db: Database);
    create(message: CommunityMessage): Promise<CommunityMessage>;
    findById(id: string): Promise<CommunityMessage | null>;
    findByCommunityId(communityId: string, limit?: number, offset?: number): Promise<CommunityMessage[]>;
    findPinnedMessages(communityId: string): Promise<CommunityMessage[]>;
    update(message: CommunityMessage): Promise<CommunityMessage>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=CommunityMessageRepository.d.ts.map