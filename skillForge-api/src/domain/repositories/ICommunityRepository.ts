// skillForge-api/src/domain/repositories/ICommunityRepository.ts
import { Community } from '../entities/Community';
import { CommunityMember } from '../entities/CommunityMember';

export interface ICommunityRepository {
  create(community: Community): Promise<Community>;
  findById(id: string): Promise<Community | null>;
  findAll(filters?: { category?: string; isActive?: boolean }): Promise<Community[]>;
  findAllWithPagination(
    filters: { search?: string; category?: string; isActive?: boolean },
    pagination: { skip: number; take: number }
  ): Promise<{ communities: Community[]; total: number }>;
  findByAdminId(adminId: string): Promise<Community[]>;
  update(id: string, community: Community): Promise<Community>;
  blockCommunity(id: string): Promise<void>;
  unblockCommunity(id: string): Promise<void>;

  // Member management
  addMember(member: CommunityMember): Promise<CommunityMember>;
  removeMember(communityId: string, userId: string): Promise<void>;
  findMembersByCommunityId(communityId: string): Promise<CommunityMember[]>;
  findMemberByUserAndCommunity(userId: string, communityId: string): Promise<CommunityMember | null>;
  findMembershipsByUserId(userId: string): Promise<CommunityMember[]>;
  isMember(communityId: string, userId: string): Promise<boolean>;
  getMembersCount(communityId: string): Promise<number>;
  updateMember(member: CommunityMember): Promise<CommunityMember>;
  upsertMember(member: CommunityMember): Promise<CommunityMember>;

  // Member count operations
  incrementMembersCount(communityId: string): Promise<void>;
  decrementMembersCount(communityId: string): Promise<void>;

  // Expiry management
  findExpiredMemberships(currentDate: Date): Promise<CommunityMember[]>;
  findExpiredMembershipsWithAutoRenew(currentDate: Date): Promise<CommunityMember[]>;
}