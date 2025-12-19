import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
import { CommunityMember } from '../../../domain/entities/CommunityMember';


@injectable()
export class CommunityRepository implements ICommunityRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) { }
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
  public async delete(id: string): Promise<void> {
    await this.prisma.community.update({
      where: { id },
      data: { isDeleted: true, updatedAt: new Date() },
    });
  }
  public async addMember(member: CommunityMember): Promise<CommunityMember> {
    const data = member.toJSON();
    const created = await this.prisma.communityMember.create({
      data: {
        id: data.id as string,
        communityId: data.community_id as string,
        userId: data.user_id as string,
        role: data.role as string,
        isAutoRenew: data.is_auto_renew as boolean,
        subscriptionEndsAt: data.subscription_ends_at as Date | null,
        joinedAt: data.joined_at as Date,
        isActive: data.is_active as boolean,
      },
    });
    return CommunityMember.fromDatabaseRow(created);
  }
  public async removeMember(communityId: string, userId: string): Promise<void> {
    await this.prisma.communityMember.updateMany({
      where: { communityId, userId },
      data: { isActive: false, leftAt: new Date() },
    });
  }
  public async findMembersByCommunityId(communityId: string): Promise<CommunityMember[]> {
    const members = await this.prisma.communityMember.findMany({
      where: { communityId, isActive: true },
      include: { user: true },
      orderBy: { joinedAt: 'asc' },
    });
    return members.map(m => CommunityMember.fromDatabaseRow(m));
  }
  public async findMemberByUserAndCommunity(userId: string, communityId: string): Promise<CommunityMember | null> {
    const member = await this.prisma.communityMember.findFirst({
      where: { userId, communityId },
    });
    return member ? CommunityMember.fromDatabaseRow(member) : null;
  }
  public async findMembershipsByUserId(userId: string): Promise<CommunityMember[]> {
    const members = await this.prisma.communityMember.findMany({
      where: { userId, isActive: true },
    });
    return members.map(m => CommunityMember.fromDatabaseRow(m));
  }
  public async updateMember(member: CommunityMember): Promise<CommunityMember> {
    const data = member.toJSON();
    const updated = await this.prisma.communityMember.update({
      where: { id: member.id },
      data: {
        isAutoRenew: data.is_auto_renew as boolean,
        subscriptionEndsAt: data.subscription_ends_at as Date | null,
        isActive: data.is_active as boolean,
        leftAt: data.left_at as Date | null,
      },
    });
    return CommunityMember.fromDatabaseRow(updated);
  }
}