import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';

export interface RejectSkillDTO {
  skillId: string;
  adminId: string;
  reason: string;
}

@injectable()
export class RejectSkillUseCase {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(data: RejectSkillDTO): Promise<void> {
    // Verify skill exists and is in review
    const skill = await this.prisma.skill.findUnique({
      where: { id: data.skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    if (skill.status !== 'in-review') {
      throw new Error('Skill is not in review status');
    }

    // Update skill status to rejected
    await this.prisma.skill.update({
      where: { id: data.skillId },
      data: {
        status: 'rejected',
        rejectionReason: data.reason,
        updatedAt: new Date(),
      },
    });

    console.log(`❌ [RejectSkillUseCase] Skill ${data.skillId} rejected by admin ${data.adminId}`);
  }
}
