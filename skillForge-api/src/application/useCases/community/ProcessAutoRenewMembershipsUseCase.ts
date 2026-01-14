import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { ITransactionService } from '../../../domain/services/ITransactionService';
import { IProcessAutoRenewMembershipsUseCase } from './interfaces/IProcessAutoRenewMembershipsUseCase';
@injectable()
export class ProcessAutoRenewMembershipsUseCase implements IProcessAutoRenewMembershipsUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService,
    @inject(TYPES.ITransactionService) private readonly transactionService: ITransactionService
  ) { }
  public async execute(): Promise<void> {
    const now = new Date();
    console.log(`[ProcessAutoRenew] Starting auto-renew check at ${now.toISOString()}`);
    const expiredAutoRenewMembers = await this.communityRepository.findExpiredMembershipsWithAutoRenew(now);
    if (expiredAutoRenewMembers.length === 0) {
      console.log('[ProcessAutoRenew] No expired auto-renew memberships found');
      return;
    }
    console.log(`[ProcessAutoRenew] Found ${expiredAutoRenewMembers.length} expired auto-renew memberships`);
    for (const membership of expiredAutoRenewMembers) {
      try {
        const memberAny = membership as unknown as Record<string, unknown>;
        const userCredits = memberAny._userCredits as number;
        const communityCost = memberAny._communityCost as number;
        const communityAdminId = memberAny._communityAdminId as string;
        const communityName = memberAny._communityName as string;
        console.log(`[ProcessAutoRenew] Processing: User ${membership.userId} in Community ${membership.communityId}`);
        console.log(`[ProcessAutoRenew] User credits: ${userCredits}, Cost: ${communityCost}`);
        if (userCredits >= communityCost) {
          await this.processSuccessfulRenewal(membership, communityCost, communityAdminId, communityName, now);
        } else {
          await this.processFailedRenewal(membership, now);
        }
      } catch (error) {
        console.error(`[ProcessAutoRenew] Failed for User ${membership.userId}:`, error);
      }
    }
    console.log(`[ProcessAutoRenew] Completed. Processed ${expiredAutoRenewMembers.length} memberships`);
  }
  private async processSuccessfulRenewal(
    membership: any,
    cost: number,
    adminId: string,
    communityName: string,
    now: Date
  ): Promise<void> {
    await this.transactionService.execute(async (repos) => {
      const user = await repos.userRepository.findById(membership.userId);
      if (!user) throw new Error('User not found');
      user.deductCredits(cost);
      await repos.userRepository.update(user);
      console.log(`[ProcessAutoRenew] Deducted ${cost} credits from user ${membership.userId}`);
      if (cost > 0 && adminId !== membership.userId) {
        const admin = await repos.userRepository.findById(adminId);
        if (admin) {
          admin.addCredits(cost, 'earned');
          await repos.userRepository.update(admin);
          console.log(`[ProcessAutoRenew] Credited ${cost} to admin ${adminId}`);
        }
      }
      membership.renewSubscription(30);
      await repos.communityRepository.updateMember(membership);
      console.log(`[ProcessAutoRenew] Renewed subscription for user ${membership.userId}`);
    });
    setImmediate(() => {
      this.webSocketService.sendToUser(membership.userId, {
        type: 'subscription_renewed',
        communityId: membership.communityId,
        data: {
          communityId: membership.communityId,
          communityName: communityName,
          message: `Your subscription to ${communityName} has been automatically renewed for 30 days.`,
          creditsDeducted: cost,
          newExpiryDate: membership.subscriptionEndsAt,
          timestamp: now.toISOString(),
        },
      });
      this.webSocketService.sendToUser(membership.userId, {
        type: 'balance_updated',
        data: {
          timestamp: now.toISOString(),
        },
      });
      console.log(`[ProcessAutoRenew] Sent renewal success notification to user ${membership.userId}`);
    });
  }
  private async processFailedRenewal(membership: any, now: Date): Promise<void> {
    const communityName = (membership as any)._communityName;
    
    await this.transactionService.execute(async (repos) => {
      membership.expireMembership();
      await repos.communityRepository.updateMember(membership);
      await repos.communityRepository.decrementMembersCount(membership.communityId);
      console.log(`[ProcessAutoRenew] Removed user ${membership.userId} - insufficient credits`);
    });
    setImmediate(() => {
      this.webSocketService.sendToCommunity(membership.communityId, {
        type: 'member_left',
        communityId: membership.communityId,
        data: {
          userId: membership.userId,
          userName: membership.userName || 'Unknown User',
          reason: 'auto_renew_failed',
          timestamp: now.toISOString(),
        },
      });
      this.webSocketService.sendToUser(membership.userId, {
        type: 'member_removed',
        communityId: membership.communityId,
        data: {
          communityId: membership.communityId,
          communityName: communityName,
          message: `Your subscription to ${communityName} could not be renewed due to insufficient credits. You have been removed from the community.`,
          reason: 'auto_renew_failed',
          timestamp: now.toISOString(),
        },
      });
      console.log(`[ProcessAutoRenew] Sent removal notification to user ${membership.userId}`);
    });
  }
}
