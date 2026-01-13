import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { ITransactionService } from '../../../domain/services/ITransactionService';
import { ICheckCommunityMembershipExpiryUseCase } from './interfaces/ICheckCommunityMembershipExpiryUseCase';

@injectable()
export class CheckCommunityMembershipExpiryUseCase implements ICheckCommunityMembershipExpiryUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService,
    @inject(TYPES.ITransactionService) private readonly transactionService: ITransactionService
  ) { }

  public async execute(): Promise<void> {
    const now = new Date();
    console.log(`[CheckCommunityMembershipExpiry] Starting expiry check at ${now.toISOString()}`);

    const expiredMemberships = await this.communityRepository.findExpiredMemberships(now);

    if (expiredMemberships.length === 0) {
      console.log('[CheckCommunityMembershipExpiry] No expired memberships found');
      return;
    }

    console.log(`[CheckCommunityMembershipExpiry] Found ${expiredMemberships.length} expired memberships`);

    for (const membership of expiredMemberships) {
      try {
        console.log(`[CheckCommunityMembershipExpiry] Processing expired membership: User ${membership.userId} in Community ${membership.communityId}`);

        // Use TransactionService for atomic operations (Clean Architecture pattern)
        await this.transactionService.execute(async (repos) => {
          // Use entity method for business logic
          membership.expireMembership();
          
          // Update member using repository
          await repos.communityRepository.updateMember(membership);
          console.log(`[CheckCommunityMembershipExpiry] Member marked as inactive`);

          // Decrement member count using repository method
          await repos.communityRepository.decrementMembersCount(membership.communityId);
          console.log(`[CheckCommunityMembershipExpiry] Member count decremented`);
        });

        console.log(`[CheckCommunityMembershipExpiry] Membership expired successfully for User ${membership.userId}`);

        // Send WebSocket notifications (outside transaction - non-critical)
        setImmediate(() => {
          // Notify the community
          this.webSocketService.sendToCommunity(membership.communityId, {
            type: 'member_left',
            communityId: membership.communityId,
            data: {
              userId: membership.userId,
              userName: membership.userName || 'Unknown User',
              reason: 'subscription_expired',
              timestamp: now.toISOString(),
            },
          });

          // Notify the user
          this.webSocketService.sendToUser(membership.userId, {
            type: 'member_removed',
            communityId: membership.communityId,
            data: {
              communityId: membership.communityId,
              message: 'Your subscription has expired. Please renew to continue accessing this community.',
              reason: 'subscription_expired',
              timestamp: now.toISOString(),
            },
          });

          console.log(`[CheckCommunityMembershipExpiry] WebSocket notifications sent for User ${membership.userId}`);
        });

      } catch (error) {
        console.error(`[CheckCommunityMembershipExpiry] Failed to expire membership for User ${membership.userId} in Community ${membership.communityId}:`, error);
      }
    }

    console.log(`[CheckCommunityMembershipExpiry] Expiry check completed. Processed ${expiredMemberships.length} memberships`);
  }
}
