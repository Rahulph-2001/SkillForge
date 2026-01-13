import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { Database } from '../../../infrastructure/database/Database';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { IRemoveCommunityMemberUseCase } from './interfaces/IRemoveCommunityMemberUseCase';

@injectable()
export class RemoveCommunityMemberUseCase implements IRemoveCommunityMemberUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService,
    @inject(TYPES.Database) private readonly database: Database
  ) { }

  public async execute(adminId: string, communityId: string, memberId: string): Promise<void> {
    console.log(`[RemoveMember] Admin ${adminId} removing member ${memberId} from community ${communityId}`);

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

    // Get user details for notification
    const user = await this.userRepository.findById(memberId);
    const userName = user?.name || 'Unknown User';

    // Use transaction for atomic removal
    await this.database.transaction(async (tx) => {
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

    console.log(`[RemoveMember] Member ${memberId} removed successfully`);

    // Broadcast WebSocket event to community
    setImmediate(() => {
      this.webSocketService.sendToCommunity(communityId, {
        type: 'member_removed',
        communityId,
        data: {
          userId: memberId,
          userName,
          removedBy: adminId,
          timestamp: new Date().toISOString(),
        },
      });

      // Notify the removed user
      this.webSocketService.sendToUser(memberId, {
        type: 'member_removed',
        communityId,
        data: {
          communityId,
          communityName: community.name,
          message: `You have been removed from ${community.name}`,
          timestamp: new Date().toISOString(),
        },
      });

      console.log(`[RemoveMember] WebSocket notifications sent`);
    });
  }
}
