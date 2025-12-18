import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { PrismaClient } from '@prisma/client';

export interface ILeaveCommunityUseCase {
  execute(userId: string, communityId: string): Promise<void>;
}

@injectable()
export class LeaveCommunityUseCase implements ILeaveCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService,
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) { }

  public async execute(userId: string, communityId: string): Promise<void> {
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }

    if (community.adminId === userId) {
      throw new ForbiddenError('Community admin cannot leave the community');
    }

    const member = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
    if (!member) {
      throw new NotFoundError('Not a member of this community');
    }

    // Use transaction for atomic update
    await this.prisma.$transaction(async (tx) => {
      // Update member status
      await tx.communityMember.updateMany({
        where: { userId, communityId, isActive: true },
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

    // Broadcast WebSocket event
    setImmediate(() => {
      this.webSocketService.sendToCommunity(communityId, {
        type: 'member_left',
        communityId,
        data: {
          userId,
          timestamp: new Date().toISOString(),
        },
      });
    });
  }
}

