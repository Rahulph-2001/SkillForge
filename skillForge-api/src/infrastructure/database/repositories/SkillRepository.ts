import { injectable, inject } from 'inversify';
import { ISkillRepository, BrowseSkillsFilters } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { Database } from '../Database';
import { TYPES } from '../../di/types';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class SkillRepository extends BaseRepository<Skill> implements ISkillRepository {
  constructor(@inject(TYPES.Database) db: Database) {
    super(db, 'skill');
  }

  async browse(filters: BrowseSkillsFilters): Promise<{ skills: Skill[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: 'approved',
      isBlocked: false,
      isAdminBlocked: false,
      isDeleted: false,
      verificationStatus: 'passed',
    };

    // Search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } },
      ];
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }

    // Level filter
    if (filters.level) {
      where.level = filters.level;
    }

    // Credits filter (changed from price)
    if (filters.minCredits !== undefined || filters.maxCredits !== undefined) {
      where.creditsPerHour = {};
      if (filters.minCredits !== undefined) {
        where.creditsPerHour.gte = filters.minCredits;
      }
      if (filters.maxCredits !== undefined) {
        where.creditsPerHour.lte = filters.maxCredits;
      }
    }

    // Exclude current user's own skills (industrial-level: prevent self-booking)
    if (filters.excludeProviderId) {
      where.providerId = {
        not: filters.excludeProviderId
      };
    }

    // Get total count
    const total = await this.prisma.skill.count({ where });

    // Get skills
    const skills = await this.prisma.skill.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    return {
      skills: skills.map((s: any) => this.toDomain(s)),
      total
    };
  }

  async findPending(): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      where: {
        status: 'in-review',
        verificationStatus: 'passed',
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return skills.map((s: any) => this.toDomain(s));
  }

  async findById(id: string): Promise<Skill | null> {
    const skill = await this.prisma.skill.findUnique({
      where: { id, isDeleted: false },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            rating: true,
            reviewCount: true,
          }
        }
      }
    });
    return skill ? this.toDomain(skill) : null;
  }

  async findByProviderId(providerId: string): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      where: {
        providerId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return skills.map((s: any) => this.toDomain(s));
  }

  async findByProviderIdWithPagination(
    providerId: string,
    filters: { page?: number; limit?: number; status?: string }
  ): Promise<{ skills: Skill[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      providerId,
      isDeleted: false,
    };

    // Status filter
    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    const [skills, total] = await Promise.all([
      this.prisma.skill.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.skill.count({ where }),
    ]);

    return {
      skills: skills.map((s: any) => this.toDomain(s)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdminWithPagination(filters: {
    page: number;
    limit: number;
    search?: string;
    status?: 'in-review' | 'approved' | 'rejected';
    isBlocked?: boolean;
  }): Promise<{
    skills: Skill[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isDeleted: false,
    };

    // Status filter
    if (filters.status) {
      where.status = filters.status;
    }

    // Blocked filter
    if (filters.isBlocked !== undefined) {
      where.isAdminBlocked = filters.isBlocked;
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
        {
          provider: {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { email: { contains: filters.search, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    const [skills, total] = await Promise.all([
      this.prisma.skill.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      this.prisma.skill.count({ where }),
    ]);

    return {
      skills: skills.map((s: any) => this.toDomain(s)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findByProviderIdAndStatus(providerId: string, status: string): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      where: {
        providerId,
        status,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return skills.map((s: any) => this.toDomain(s));
  }

  async findAll(): Promise<Skill[]> {
    const skills = await super.findAll();
    return skills
      .filter((s: any) => !s.isDeleted)
      .map((s: any) => this.toDomain(s));
  }

  async create(skill: Skill): Promise<Skill> {
    const created = await this.prisma.skill.create({
      data: {
        id: skill.id,
        providerId: skill.providerId,
        templateId: skill.templateId,
        title: skill.title,
        description: skill.description,
        category: skill.category,
        level: skill.level,
        creditsPerHour: skill.creditsPerHour,
        durationHours: skill.durationHours,
        tags: skill.tags,
        status: skill.status,
        verificationStatus: skill.verificationStatus,
        isBlocked: skill.isBlocked,
        isAdminBlocked: skill.isAdminBlocked,
        blockedReason: skill.blockedReason,
        imageUrl: skill.imageUrl,
        rating: skill.rating,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
      },
    });
    return this.toDomain(created);
  }

  async update(skill: Skill): Promise<Skill> {
    const updated = await this.prisma.skill.update({
      where: { id: skill.id },
      data: {
        title: skill.title,
        description: skill.description,
        category: skill.category,
        level: skill.level,
        creditsPerHour: skill.creditsPerHour,
        durationHours: skill.durationHours,
        tags: skill.tags,
        status: skill.status,
        verificationStatus: skill.verificationStatus,
        isBlocked: skill.isBlocked,
        isAdminBlocked: skill.isAdminBlocked,
        blockedReason: skill.blockedReason,
        imageUrl: skill.imageUrl,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await super.delete(id);
  }

  private toDomain(data: any): Skill {
    return new Skill({
      id: data.id,
      providerId: data.providerId,
      title: data.title,
      description: data.description,
      category: data.category,
      level: data.level,
      durationHours: data.durationHours,
      creditsPerHour: Number(data.creditsPerHour),
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      templateId: data.templateId,
      status: data.status as any,
      verificationStatus: data.verificationStatus,
      mcqScore: data.mcqScore,
      mcqTotalQuestions: data.mcqTotalQuestions,
      mcqPassingScore: data.mcqPassingScore,
      verifiedAt: data.verifiedAt,
      totalSessions: data.totalSessions || 0,
      rating: data.rating || 0,
      isBlocked: data.isBlocked || false,
      blockedReason: data.blockingReason,
      blockedAt: data.blockedAt,
      isAdminBlocked: data.isAdminBlocked || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}