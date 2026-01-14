import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ForbiddenError, NotFoundError, BadRequestError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUnblockCommunityUseCase } from './interfaces/IUnblockCommunityUseCase';
import { UnblockCommunityRequestDTO } from '../../dto/admin/UnblockCommunityRequestDTO';

/**
 * Unblock Community Use Case (Admin)
 * 
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community unblocking logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 * 
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
@injectable()
export class UnblockCommunityUseCase implements IUnblockCommunityUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
    ) { }

    async execute(request: UnblockCommunityRequestDTO): Promise<{ message: string }> {
        // 1. Verify admin user (Authorization)
        const adminUser = await this.userRepository.findById(request.adminUserId);
        if (!adminUser || adminUser.role !== UserRole.ADMIN) {
            throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }

        // 2. Verify community exists
        const community = await this.communityRepository.findById(request.communityId);
        if (!community) {
            throw new NotFoundError('Community not found');
        }

        // 3. Business Rule: Check if already active
        if (community.isActive) {
            throw new BadRequestError('Community is already active');
        }

        // 4. Unblock community (set isActive = true)
        await this.communityRepository.unblockCommunity(request.communityId);

        // 5. Log unblocking for audit trail (if reason provided)
        if (request.reason) {
            console.log(
                `[UnblockCommunityUseCase] Community ${request.communityId} unblocked by admin ${request.adminUserId}. Reason: ${request.reason}`
            );
        }

        return {
            message: `Community "${community.name}" has been successfully unblocked`,
        };
    }
}
