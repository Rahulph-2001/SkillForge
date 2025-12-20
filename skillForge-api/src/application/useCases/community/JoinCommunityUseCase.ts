import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { NotFoundError, ConflictError, ValidationError } from '../../../domain/errors/AppError';
import { PrismaClient } from '@prisma/client';


export interface IJoinCommunityUseCase {
  execute(userId: string, communityId: string): Promise<CommunityMember>;
}

@injectable()
export class JoinCommunityUseCase implements IJoinCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService,
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) { }

  public async execute(userId: string, communityId: string): Promise<CommunityMember> {
    // Use Prisma transaction to ensure atomicity
    return await this.prisma.$transaction(async (tx) => {
      // 1. Find community
      const community = await this.communityRepository.findById(communityId);
      if (!community) {
        throw new NotFoundError('Community not found');
      }

      // 2. Check if already a member
      const existingMember = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
      if (existingMember && existingMember.isActive) {
        throw new ConflictError('Already a member of this community');
      }

      // 3. Find user and verify credits
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.credits < community.creditsCost) {
        throw new ValidationError(`Insufficient credits to join community. Required: ${community.creditsCost}, Available: ${user.credits}`);
      }

      // 4. Deduct credits from user
      user.deductCredits(community.creditsCost);
      await tx.user.update({
        where: { id: userId },
        data: {
          credits: user.credits,
          updatedAt: new Date(),
        },
      });

      // 5. Calculate subscription end date
      const subscriptionEndsAt = new Date();
      subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 30); // Default 30 days

      // 6. Create or reactivate member record (upsert for rejoin support)
      const member = new CommunityMember({
        communityId,
        userId,
        role: 'member',
        subscriptionEndsAt,
      });

      const memberData = member.toJSON();
      await tx.communityMember.upsert({
        where: {
          communityId_userId: {
            communityId: communityId,
            userId: userId,
          },
        },
        create: {
          id: memberData.id as string,
          communityId: memberData.communityId as string,
          userId: memberData.userId as string,
          role: memberData.role as string,
          isAutoRenew: memberData.isAutoRenew as boolean,
          subscriptionEndsAt: memberData.subscriptionEndsAt as Date | null,
          joinedAt: memberData.joinedAt as Date,
          isActive: true,
        },
        update: {
          isActive: true,
          role: 'member',
          subscriptionEndsAt: memberData.subscriptionEndsAt as Date | null,
          joinedAt: new Date(),
          leftAt: null,
        },
      });

      // 7. Increment member count
      await tx.community.update({
        where: { id: communityId },
        data: {
          membersCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });

      // 8. Broadcast WebSocket event (outside transaction - non-critical)
      setImmediate(() => {
        this.webSocketService.sendToCommunity(communityId, {
          type: 'member_joined',
          communityId,
          data: {
            userId,
            userName: user.name,
            timestamp: new Date().toISOString(),
          },
        });
      });

      return member;
    });
  }
}