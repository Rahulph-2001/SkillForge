import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../domain/errors/AppError';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

export interface SkillDetailsDTO {
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
    rating: number;
    reviewCount: number;
  };
}

@injectable()
export class GetSkillDetailsUseCase {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(skillId: string): Promise<SkillDetailsDTO> {
    // Fetch skill with provider details
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!skill) {
      throw new AppError('Skill not found', HttpStatusCode.NOT_FOUND);
    }

    // Only show approved, verified, non-blocked, non-deleted skills
    if (
      skill.status !== 'approved' ||
      skill.verificationStatus !== 'passed' ||
      skill.isBlocked ||
      skill.isDeleted
    ) {
      throw new AppError('Skill not available', HttpStatusCode.NOT_FOUND);
    }

    // Parse tags
    const tags = Array.isArray(skill.tags) ? skill.tags : [];

    // Use rating and totalSessions from skill model
    const rating = skill.rating ? Number(skill.rating) : 0;
    const totalSessions = skill.totalSessions || 0;

    // Calculate provider stats from all their skills
    const providerSkills = await this.prisma.skill.findMany({
      where: {
        providerId: skill.providerId,
        status: 'approved',
        verificationStatus: 'passed',
        isBlocked: false,
        isDeleted: false,
      },
      select: {
        rating: true,
        totalSessions: true,
      },
    });

    const providerTotalRating = providerSkills.reduce(
      (sum: number, s) => sum + (s.rating ? Number(s.rating) : 0),
      0
    );
    const providerAverageRating =
      providerSkills.length > 0 ? providerTotalRating / providerSkills.length : 0;
    const providerTotalSessions = providerSkills.reduce(
      (sum: number, s) => sum + (s.totalSessions || 0),
      0
    );

    return {
      id: skill.id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      durationHours: skill.durationHours,
      creditsPerHour: skill.creditsPerHour,
      imageUrl: skill.imageUrl,
      tags,
      rating: Number(rating.toFixed(1)),
      totalSessions,
      provider: {
        id: skill.provider.id,
        name: skill.provider.name,
        email: skill.provider.email,
        rating: Number(providerAverageRating.toFixed(1)),
        reviewCount: providerTotalSessions,
      },
    };
  }
}
