import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../../infrastructure/di/types';

@injectable()
export class UnblockSkillUseCase {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(skillId: string, adminId: string): Promise<void> {
    // Verify skill exists
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    if (!skill.isBlocked) {
      throw new Error('Skill is not blocked');
    }

    // Unblock the skill
    await this.prisma.skill.update({
      where: { id: skillId },
      data: {
        isBlocked: false,
        blockedReason: null,
        blockedAt: null,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ [UnblockSkillUseCase] Skill ${skillId} unblocked by admin ${adminId}`);
  }
}
