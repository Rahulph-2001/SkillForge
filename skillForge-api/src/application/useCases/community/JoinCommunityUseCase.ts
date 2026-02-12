import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { CommunityMemberResponseDTO } from '../../dto/community/CommunityMemberResponseDTO';
import { NotFoundError, ConflictError, ValidationError } from '../../../domain/errors/AppError';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';
import { v4 as uuidv4 } from 'uuid';
import { IJoinCommunityUseCase } from './interfaces/IJoinCommunityUseCase';
import { ITransactionService } from '../../../domain/services/ITransactionService';

@injectable()
export class JoinCommunityUseCase implements IJoinCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService,
    @inject(TYPES.ITransactionService) private readonly transactionService: ITransactionService,
    @inject(TYPES.IUserWalletTransactionRepository) private readonly userWalletTransactionRepository: IUserWalletTransactionRepository
  ) { }

  public async execute(userId: string, communityId: string): Promise<CommunityMemberResponseDTO> {
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

    // 4. Find community creator
    const creator = await this.userRepository.findById(community.adminId);
    if (!creator) {
      throw new NotFoundError('Community creator not found');
    }

    // 5. Use transaction service for atomic operations
    console.log(`[JoinCommunity] Starting transaction for user ${userId} joining community ${communityId}`);
    console.log(`[JoinCommunity] User credits before: ${user.credits}, Community cost: ${community.creditsCost}`);
    console.log(`[JoinCommunity] Creator credits before: ${creator.credits}`);

    const member = await this.transactionService.execute(async (repos) => {
      // Deduct credits from joining user
      const userCreditsBefore = user.credits;
      user.deductCredits(community.creditsCost);
      console.log(`[JoinCommunity] User credits after deduction: ${user.credits} (deducted ${community.creditsCost})`);

      const updatedUser = await repos.userRepository.update(user);
      console.log(`[JoinCommunity] User updated in DB. Credits in DB: ${updatedUser.credits}`);

      // Transaction 1: Debit User
      if (community.creditsCost > 0) {
        await this.userWalletTransactionRepository.create(UserWalletTransaction.create({
          id: uuidv4(),
          userId: userId,
          type: UserWalletTransactionType.COMMUNITY_JOIN,
          amount: community.creditsCost,
          currency: 'CREDITS',
          source: 'COMMUNITY_JOIN',
          referenceId: communityId,
          description: `Joined community: ${community.name}`,
          previousBalance: userCreditsBefore,
          newBalance: updatedUser.credits,
          status: UserWalletTransactionStatus.COMPLETED,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      }

      // Credit creator (if not joining own community)
      if (community.creditsCost > 0 && creator.id !== userId) {
        const creatorCreditsBefore = creator.credits;
        creator.addCredits(community.creditsCost, 'earned');
        console.log(`[JoinCommunity] Creator credits after addition: ${creator.credits} (added ${community.creditsCost})`);

        const updatedCreator = await repos.userRepository.update(creator);
        console.log(`[JoinCommunity] Creator updated in DB. Credits in DB: ${updatedCreator.credits}`);

        // Transaction 2: Credit Creator
        await this.userWalletTransactionRepository.create(UserWalletTransaction.create({
          id: uuidv4(),
          userId: creator.id,
          type: UserWalletTransactionType.COMMUNITY_EARNING,
          amount: community.creditsCost,
          currency: 'CREDITS',
          source: 'COMMUNITY_JOIN',
          referenceId: communityId,
          description: `Member joined community: ${community.name}`,
          previousBalance: creatorCreditsBefore,
          newBalance: updatedCreator.credits,
          status: UserWalletTransactionStatus.COMPLETED,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      }

      // Calculate subscription end date
      const subscriptionEndsAt = new Date();
      subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 30);

      // Create or reactivate member record
      const newMember = new CommunityMember({
        communityId,
        userId,
        role: 'member',
        subscriptionEndsAt,
      });

      const upsertedMember = await repos.communityRepository.upsertMember(newMember);
      console.log(`[JoinCommunity] Member record created/updated`);

      // Increment member count
      await repos.communityRepository.incrementMembersCount(communityId);
      console.log(`[JoinCommunity] Member count incremented`);

      return upsertedMember;
    });

    console.log(`[JoinCommunity] Transaction completed successfully`);

    // 6. Fetch fresh user data to get updated credits from DB
    const updatedUser = await this.userRepository.findById(userId);
    console.log(`[JoinCommunity] Fresh user data fetched. Credits: ${updatedUser?.credits}`);

    // 7. Broadcast WebSocket events (outside transaction - non-critical)
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

      // Notify user about balance update with fresh data
      console.log(`[JoinCommunity] Sending balance update via WebSocket to user ${userId}`);
      this.webSocketService.sendToUser(userId, {
        type: 'balance_updated',
        data: {
          credits: updatedUser?.credits || user.credits,
          walletBalance: updatedUser?.walletBalance || user.walletBalance,
          timestamp: new Date().toISOString(),
        },
      });
    });

    // 7. Return DTO
    const memberData = member.toJSON();
    return {
      id: memberData.id as string,
      userId: memberData.userId as string,
      communityId: memberData.communityId as string,
      role: memberData.role as string,
      isAutoRenew: memberData.isAutoRenew as boolean,
      subscriptionEndsAt: memberData.subscriptionEndsAt as Date | null,
      joinedAt: memberData.joinedAt as Date,
      leftAt: memberData.leftAt as Date | null,
      isActive: memberData.isActive as boolean,
    };
  }
}