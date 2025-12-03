import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';

export interface PendingSkillDTO {
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
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
export class ListPendingSkillsUseCase {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(): Promise<PendingSkillDTO[]> {
    // Get all skills that passed MCQ and are waiting for admin approval
    const skills = await this.prisma.skill.findMany({
      where: {
        status: 'in-review',
        verificationStatus: 'passed',
        isDeleted: false,
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
        verifiedAt: 'desc',
      },
    });

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
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    }));
  }
}
