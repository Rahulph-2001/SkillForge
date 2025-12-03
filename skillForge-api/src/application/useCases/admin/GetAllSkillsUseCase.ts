import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../../infrastructure/di/types';

export interface SkillDTO {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  tags: string[];
  imageUrl: string | null;
  templateId: string | null;
  status: string;
  verificationStatus: string | null;
  mcqScore: number | null;
  mcqTotalQuestions: number | null;
  mcqPassingScore: number | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;
  isBlocked: boolean;
  blockedReason: string | null;
  blockedAt: Date | null;
  totalSessions: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
export class GetAllSkillsUseCase {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(): Promise<SkillDTO[]> {
    console.log('🔵 [GetAllSkillsUseCase] Fetching all skills for admin');

    const skills = await this.prisma.skill.findMany({
      where: {
        isDeleted: false,
        verificationStatus: {
          not: 'failed' // Exclude failed MCQ skills (they are not saved)
        }
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ [GetAllSkillsUseCase] Found ${skills.length} skills`);

    return skills.map(skill => ({
      id: skill.id,
      providerId: skill.providerId,
      providerName: skill.provider.name,
      providerEmail: skill.provider.email,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      durationHours: skill.durationHours,
      creditsPerHour: skill.creditsPerHour,
      tags: skill.tags,
      imageUrl: skill.imageUrl,
      templateId: skill.templateId,
      status: skill.status,
      verificationStatus: skill.verificationStatus,
      mcqScore: skill.mcqScore,
      mcqTotalQuestions: skill.mcqTotalQuestions,
      mcqPassingScore: skill.mcqPassingScore,
      verifiedAt: skill.verifiedAt,
      rejectionReason: skill.rejectionReason,
      isBlocked: skill.isBlocked,
      blockedReason: skill.blockedReason,
      blockedAt: skill.blockedAt,
      totalSessions: skill.totalSessions,
      rating: Number(skill.rating),
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    }));
  }
}
