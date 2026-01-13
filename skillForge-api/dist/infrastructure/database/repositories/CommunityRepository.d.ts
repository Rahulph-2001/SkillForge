import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class CommunityRepository extends BaseRepository<Community> implements ICommunityRepository {
    constructor(db: Database);
    create(community: Community): Promise<Community>;
    findById(id: string): Promise<Community | null>;
    findAll(filters?: {
        category?: string;
        isActive?: boolean;
    }): Promise<Community[]>;
    findByAdminId(adminId: string): Promise<Community[]>;
    update(id: string, community: Community): Promise<Community>;
    delete(id: string): Promise<void>;
    findMembersByCommunityId(communityId: string): Promise<CommunityMember[]>;
    findMemberByUserAndCommunity(communityId: string, userId: string): Promise<CommunityMember | null>;
    createMember(member: CommunityMember): Promise<CommunityMember>;
    updateMember(member: CommunityMember): Promise<CommunityMember>;
    upsertMember(member: CommunityMember): Promise<CommunityMember>;
    addMember(member: CommunityMember): Promise<CommunityMember>;
    removeMember(communityId: string, userId: string): Promise<void>;
    findMembershipsByUserId(userId: string): Promise<CommunityMember[]>;
    incrementMembersCount(communityId: string): Promise<void>;
}
//# sourceMappingURL=CommunityRepository.d.ts.map