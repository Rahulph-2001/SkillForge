import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IDeleteCommunityUseCase } from './interfaces/IDeleteCommunityUseCase';
import { DeleteCommunityRequestDTO } from '../../dto/admin/DeleteCommunityRequestDTO';

/**
 * Delete Community Use Case (Admin)
 * 
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community deletion logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 * 
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
@injectable()
export class DeleteCommunityUseCase implements IDeleteCommunityUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
    ) { }

    async execute(request: DeleteCommunityRequestDTO): Promise<{ message: string }> {
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

        // 3. Business Rule: Check if community has active members
        // For now, we'll allow deletion regardless, but log a warning
        // In production, you might want to prevent deletion or require a force flag
        if (community.membersCount > 0) {
            console.warn(
                `[DeleteCommunityUseCase] Deleting community ${request.communityId} with ${community.membersCount} active members`
            );
            // Optional: Throw error to prevent deletion
            // throw new BadRequestError(`Cannot delete community with ${community.membersCount} active members`);
        }

        // 4. Delete community (soft delete via BaseRepository)
        await this.communityRepository.delete(request.communityId);

        // 5. Log deletion for audit trail (if reason provided)
        if (request.reason) {
            console.log(
                `[DeleteCommunityUseCase] Community ${request.communityId} deleted by admin ${request.adminUserId}. Reason: ${request.reason}`
            );
        }

        return {
            message: `Community "${community.name}" has been successfully deleted`,
        };
    }
}
