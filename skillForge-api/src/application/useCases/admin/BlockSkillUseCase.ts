import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../../infrastructure/di/types';

export interface BlockSkillDTO {
  skillId: string;
  adminId: string;
  reason: string;
}

@injectable()
export class BlockSkillUseCase {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(data: BlockSkillDTO): Promise<void> {
    // Verify skill exists
    const skill = await this.prisma.skill.findUnique({
      where: { id: data.skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    // Only approved skills can be blocked
    if (skill.status !== 'approved') {
      throw new Error('Only approved skills can be blocked');
    }

    if (skill.isBlocked) {
      throw new Error('Skill is already blocked');
    }

    // Block the skill
    await this.prisma.skill.update({
      where: { id: data.skillId },
      data: {
        isBlocked: true,
        blockedReason: data.reason,
        blockedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  }
}
