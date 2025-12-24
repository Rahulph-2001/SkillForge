import { PrismaClient } from '@prisma/client';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
export declare class CommunityRepository implements ICommunityRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(community: Community): Promise<Community>;
    findById(id: string): Promise<Community | null>;
    findAll(filters?: {
        category?: string;
        isActive?: boolean;
    }): Promise<Community[]>;
    findByAdminId(adminId: string): Promise<Community[]>;
    update(id: string, community: Community): Promise<Community>;
    delete(id: string): Promise<void>;
    addMember(member: CommunityMember): Promise<CommunityMember>;
    removeMember(communityId: string, userId: string): Promise<void>;
    findMembersByCommunityId(communityId: string): Promise<CommunityMember[]>;
    findMemberByUserAndCommunity(userId: string, communityId: string): Promise<CommunityMember | null>;
    findMembershipsByUserId(userId: string): Promise<CommunityMember[]>;
    updateMember(member: CommunityMember): Promise<CommunityMember>;
}
//# sourceMappingURL=CommunityRepository.d.ts.map