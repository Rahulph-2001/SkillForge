import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';

export interface BrowseSkillsFilters {
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  excludeProviderId?: string;
}

export interface BrowseSkillDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  imageUrl: string | null;
  tags: string[];
  rating: number;
  totalSessions: number;
  provider: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BrowseSkillsResponse {
  skills: BrowseSkillDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@injectable()
export class BrowseSkillsUseCase {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(filters: BrowseSkillsFilters): Promise<BrowseSkillsResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: 'approved',
      isBlocked: false,
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
    if (filters.level && filters.level !== 'All Levels') {
      where.level = filters.level;
    }

    // Price filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.creditsPerHour = {};
      if (filters.minPrice !== undefined) {
        where.creditsPerHour.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.creditsPerHour.lte = filters.maxPrice;
      }
    }

    // Exclude user's own skills
    if (filters.excludeProviderId) {
      where.providerId = {
        not: filters.excludeProviderId
      };
    }

    // Get total count
    const total = await this.prisma.skill.count({ where });

    // Get skills with provider info
    const skills = await this.prisma.skill.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    const skillDTOs: BrowseSkillDTO[] = skills.map(skill => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      durationHours: skill.durationHours,
      creditsPerHour: skill.creditsPerHour,
      imageUrl: skill.imageUrl,
      tags: skill.tags,
      rating: Number(skill.rating),
      totalSessions: skill.totalSessions,
      provider: {
        id: skill.provider.id,
        name: skill.provider.name,
        email: skill.provider.email,
      }
    }));

    return {
      skills: skillDTOs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
