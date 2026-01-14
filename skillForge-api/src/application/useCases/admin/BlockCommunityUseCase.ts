import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ForbiddenError, NotFoundError, BadRequestError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IBlockCommunityUseCase } from './interfaces/IBlockCommunityUseCase';
import { BlockCommunityRequestDTO } from '../../dto/admin/BlockCommunityRequestDTO';

/**
 * Block Community Use Case (Admin)
 * 
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community blocking logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 * 
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
@injectable()
export class BlockCommunityUseCase implements IBlockCommunityUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
    ) { }

    async execute(request: BlockCommunityRequestDTO): Promise<{ message: string }> {
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

        // 3. Business Rule: Check if already blocked
        if (!community.isActive) {
            throw new BadRequestError('Community is already blocked');
        }

        // 4. Block community (set isActive = false)
        await this.communityRepository.blockCommunity(request.communityId);

        // 5. Log blocking for audit trail (if reason provided)
        if (request.reason) {
            console.log(
                `[BlockCommunityUseCase] Community ${request.communityId} blocked by admin ${request.adminUserId}. Reason: ${request.reason}`
            );
        }

        return {
            message: `Community "${community.name}" has been successfully blocked`,
        };
    }
}
