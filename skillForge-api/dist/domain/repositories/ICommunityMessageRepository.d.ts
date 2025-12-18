import { CommunityMessage } from '../entities/CommunityMessage';
export interface ICommunityMessageRepository {
    create(message: CommunityMessage): Promise<CommunityMessage>;
    findById(id: string): Promise<CommunityMessage | null>;
    findByCommunityId(communityId: string, limit?: number, offset?: number): Promise<CommunityMessage[]>;
    findPinnedMessages(communityId: string): Promise<CommunityMessage[]>;
    update(message: CommunityMessage): Promise<CommunityMessage>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=ICommunityMessageRepository.d.ts.map