import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';

import { Database } from '../../../infrastructure/database/Database';

@injectable()
export class ApproveSkillUseCase {
  private prisma: PrismaClient;

  constructor(
    @inject(TYPES.Database) database: Database
  ) {
    this.prisma = database.getClient();
  }

  async execute(skillId: string, _adminId: string): Promise<void> {
    // Verify skill exists and is in review
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    if (skill.status !== 'in-review') {
      throw new Error('Skill is not in review status');
    }

    // Allow admin to approve even if verification is not passed (manual override)
    // But we should log it or ensure it sets verificationStatus to passed

    // Update skill status to approved AND ensure verificationStatus is passed
    await this.prisma.skill.update({
      where: { id: skillId },
      data: {
        status: 'approved',
        verificationStatus: 'passed', // Ensure it shows in browse skills
        updatedAt: new Date(),
      },
    });

  }
}
