// skillForge-api/src/infrastructure/database/repositories/CommunityRepository.ts
import { injectable, inject } from 'inversify';
import { PrismaClient, Prisma } from '@prisma/client';
import { TYPES } from '../../di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class CommunityRepository extends BaseRepository<Community> implements ICommunityRepository {
  constructor(
    @inject(TYPES.Database) db: Database
  ) {
    super(db, 'community');
  }

  public async create(community: Community): Promise<Community> {
    const data = community.toJSON();
    const created = await this.prisma.community.create({
      data: {
        id: data.id as string,
        name: data.name as string,
        description: data.description as string,
        category: data.category as string,
        imageUrl: data.image_url as string | null,
        videoUrl: data.video_url as string | null,
        adminId: data.admin_id as string,
        creditsCost: data.credits_cost as number,
        creditsPeriod: data.credits_period as string,
        membersCount: data.members_count as number,
        isActive: data.is_active as boolean,
        isDeleted: data.is_deleted as boolean,
        createdAt: data.created_at as Date,
        updatedAt: data.updated_at as Date,
      },
    });
    return Community.fromDatabaseRow(created);
  }

  public async findById(id: string): Promise<Community | null> {
    const community = await this.prisma.community.findUnique({
      where: { id },
    });
    return community ? Community.fromDatabaseRow(community) : null;
  }


  public async findAll(filters?: { category?: string; isActive?: boolean }): Promise<Community[]> {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    const communities = await this.prisma.community.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return communities.map(c => Community.fromDatabaseRow(c));
  }

  public async findAllWithPagination(
    filters: { search?: string; category?: string; isActive?: boolean },
    pagination: { skip: number; take: number }
  ): Promise<{ communities: Community[]; total: number }> {
    // Build dynamic where clause
    const where: any = {};

    // Search filter - case-insensitive search on name and description
    if (filters.search && filters.search.trim()) {
      where.OR = [
        { name: { contains: filters.search.trim(), mode: 'insensitive' } },
        { description: { contains: filters.search.trim(), mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (filters.category) {
      where.category = filters.category;
    }

    // Active status filter
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // Execute queries in parallel for better performance
    const [communities, total] = await Promise.all([
      this.prisma.community.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.community.count({ where }),
    ]);

    return {
      communities: communities.map(c => Community.fromDatabaseRow(c)),
      total,
    };
  }


  public async findByAdminId(adminId: string): Promise<Community[]> {
    const communities = await this.prisma.community.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
    });
    return communities.map(c => Community.fromDatabaseRow(c));
  }

  public async update(id: string, community: Community): Promise<Community> {
    const data = community.toJSON();
    const updated = await this.prisma.community.update({
      where: { id },
      data: {
        name: data.name as string,
        description: data.description as string,
        category: data.category as string,
        imageUrl: data.image_url as string | null,
        videoUrl: data.video_url as string | null,
        creditsCost: data.credits_cost as number,
        creditsPeriod: data.credits_period as string,
        membersCount: data.members_count as number,
        isActive: data.is_active as boolean,
        updatedAt: new Date(),
      },
    });
    return Community.fromDatabaseRow(updated);
  }

  /**
   * Block a community (set isActive to false)
   * Following Single Responsibility Principle
   */
  public async blockCommunity(id: string): Promise<void> {
    await this.prisma.community.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Unblock a community (set isActive to true)
   * Following Single Responsibility Principle
   */
  public async unblockCommunity(id: string): Promise<void> {
    await this.prisma.community.update({
      where: { id },
      data: {
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }

  public async findMembersByCommunityId(communityId: string): Promise<CommunityMember[]> {
    const members = await this.prisma.communityMember.findMany({
      where: { communityId, isActive: true },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { joinedAt: 'desc' },
    });

    return members.map(m => {
      const member = CommunityMember.fromDatabaseRow(m);
      const memberAny = member as unknown as Record<string, unknown>;
      if (m.user) {
        memberAny._userName = m.user.name;
        memberAny._userAvatar = m.user.avatarUrl;
      }
      return member;
    });
  }

  public async findMemberByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityMember | null> {
    const member = await this.prisma.communityMember.findFirst({
      where: {
        userId,
        communityId,
        isActive: true,
      },
    });

    if (!member) return null;

    return CommunityMember.fromDatabaseRow(member);
  }

  public async isMember(communityId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.communityMember.findFirst({
      where: {
        communityId,
        userId,
        isActive: true,
      },
    });

    return member !== null;
  }

  public async getMembersCount(communityId: string): Promise<number> {
    return await this.prisma.communityMember.count({
      where: {
        communityId,
        isActive: true,
      },
    });
  }

  public async createMember(member: CommunityMember): Promise<CommunityMember> {
    const data = member.toJSON();
    const created = await this.prisma.communityMember.create({
      data: {
        id: data.id as string,
        communityId: data.communityId as string,
        userId: data.userId as string,
        role: data.role as string,
        isAutoRenew: data.isAutoRenew as boolean,
        subscriptionEndsAt: data.subscriptionEndsAt as Date | null,
        joinedAt: data.joinedAt as Date,
        isActive: data.isActive as boolean,
      },
    });
    return CommunityMember.fromDatabaseRow(created);
  }

  public async updateMember(member: CommunityMember): Promise<CommunityMember> {
    const data = member.toJSON();
    const updated = await this.prisma.communityMember.update({
      where: { id: member.id },
      data: {
        role: data.role as string,
        isAutoRenew: data.isAutoRenew as boolean,
        subscriptionEndsAt: data.subscriptionEndsAt as Date | null,
        leftAt: data.leftAt as Date | null,
        isActive: data.isActive as boolean,
      },
    });
    return CommunityMember.fromDatabaseRow(updated);
  }

  public async upsertMember(member: CommunityMember): Promise<CommunityMember> {
    const data = member.toJSON();
    const upserted = await this.prisma.communityMember.upsert({
      where: {
        communityId_userId: {
          communityId: data.communityId as string,
          userId: data.userId as string,
        },
      },
      create: {
        id: data.id as string,
        communityId: data.communityId as string,
        userId: data.userId as string,
        role: data.role as string,
        isAutoRenew: data.isAutoRenew as boolean,
        subscriptionEndsAt: data.subscriptionEndsAt as Date | null,
        joinedAt: data.joinedAt as Date,
        isActive: data.isActive as boolean,
      },
      update: {
        isActive: data.isActive as boolean,
        role: data.role as string,
        subscriptionEndsAt: data.subscriptionEndsAt as Date | null,
        joinedAt: new Date(),
        leftAt: null,
      },
    });
    return CommunityMember.fromDatabaseRow(upserted);
  }

  public async addMember(member: CommunityMember): Promise<CommunityMember> {
    return this.createMember(member);
  }

  public async removeMember(communityId: string, userId: string): Promise<void> {
    await this.prisma.communityMember.updateMany({
      where: {
        communityId,
        userId,
      },
      data: {
        isActive: false,
        leftAt: new Date(),
      },
    });
  }

  public async findMembershipsByUserId(userId: string): Promise<CommunityMember[]> {
    const members = await this.prisma.communityMember.findMany({
      where: { userId, isActive: true },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { joinedAt: 'desc' },
    });

    return members.map(m => {
      const member = CommunityMember.fromDatabaseRow(m);
      const memberAny = member as unknown as Record<string, unknown>;
      if (m.user) {
        memberAny._userName = m.user.name;
        memberAny._userAvatar = m.user.avatarUrl;
      }
      return member;
    });
  }

  public async incrementMembersCount(communityId: string): Promise<void> {
    await this.prisma.community.update({
      where: { id: communityId },
      data: {
        membersCount: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  }

  public async decrementMembersCount(communityId: string): Promise<void> {
    await this.prisma.community.update({
      where: { id: communityId },
      data: {
        membersCount: { decrement: 1 },
        updatedAt: new Date(),
      },
    });
  }

  public async findExpiredMemberships(currentDate: Date): Promise<CommunityMember[]> {
    const expiredMembers = await this.prisma.communityMember.findMany({
      where: {
        isActive: true,
        isAutoRenew: false,
        subscriptionEndsAt: {
          lte: currentDate,
          not: null,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        community: {
          select: {
            name: true,
          },
        },
      },
    });
    return expiredMembers.map(m => {
      const member = CommunityMember.fromDatabaseRow(m);
      const memberAny = member as unknown as Record<string, unknown>;
      if (m.user) {
        memberAny._userName = m.user.name;
        memberAny._userAvatar = m.user.avatarUrl;
      }
      return member;
    });
  }
  public async findExpiredMembershipsWithAutoRenew(currentDate: Date): Promise<CommunityMember[]> {
    const expiredMembers = await this.prisma.communityMember.findMany({
      where: {
        isActive: true,
        isAutoRenew: true,
        subscriptionEndsAt: {
          lte: currentDate,
          not: null,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            credits: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            creditsCost: true,
            adminId: true,
          },
        },
      },
    });
    return expiredMembers.map(m => {
      const member = CommunityMember.fromDatabaseRow(m);
      const memberAny = member as unknown as Record<string, unknown>;
      if (m.user) {
        memberAny._userName = m.user.name;
        memberAny._userAvatar = m.user.avatarUrl;
        memberAny._userCredits = m.user.credits;
      }
      if (m.community) {
        memberAny._communityName = m.community.name;
        memberAny._communityCost = m.community.creditsCost;
        memberAny._communityAdminId = m.community.adminId;
      }
      return member;
    });
  }
}
