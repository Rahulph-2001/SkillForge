import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { PrismaClient } from '@prisma/client';

export interface IRemoveCommunityMemberUseCase {
  execute(adminId: string, communityId: string, memberId: string): Promise<void>;
}

@injectable()
export class RemoveCommunityMemberUseCase implements IRemoveCommunityMemberUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) { }

  public async execute(adminId: string, communityId: string, memberId: string): Promise<void> {
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }

    if (community.adminId !== adminId) {
      throw new ForbiddenError('Only community admin can remove members');
    }

    const member = await this.communityRepository.findMemberByUserAndCommunity(memberId, communityId);
    if (!member) {
      throw new NotFoundError('Member not found in this community');
    }

    // Use transaction for atomic removal
    await this.prisma.$transaction(async (tx) => {
      // Remove member
      await tx.communityMember.updateMany({
        where: { userId: memberId, communityId, isActive: true },
        data: {
          isActive: false,
          leftAt: new Date(),
        },
      });

      // Decrement member count
      await tx.community.update({
        where: { id: communityId },
        data: {
          membersCount: { decrement: 1 },
          updatedAt: new Date(),
        },
      });
    });
  }
}
