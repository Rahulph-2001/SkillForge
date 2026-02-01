import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { Community } from '../../../domain/entities/Community';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUpdateCommunityByAdminUseCase } from './interfaces/IUpdateCommunityByAdminUseCase';
import { UpdateCommunityByAdminRequestDTO } from '../../dto/admin/UpdateCommunityByAdminRequestDTO';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';

/**
 * Update Community By Admin Use Case
 * 
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community update logic for admins
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository, ICommunityMapper)
 * - Open/Closed: Can be extended without modification
 * 
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
@injectable()
export class UpdateCommunityByAdminUseCase implements IUpdateCommunityByAdminUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
        @inject(TYPES.ICommunityMapper) private readonly communityMapper: ICommunityMapper
    ) { }

    async execute(request: UpdateCommunityByAdminRequestDTO): Promise<CommunityResponseDTO> {
        // 1. Verify user exists
        const user = await this.userRepository.findById(request.adminUserId);
        if (!user) {
            throw new ForbiddenError('User not found');
        }

        // 2. Verify community exists
        const community = await this.communityRepository.findById(request.communityId);
        if (!community) {
            throw new NotFoundError('Community not found');
        }

        // 3. Authorization: Allow both admin users AND community creator
        const isAdmin = user.role === UserRole.ADMIN;
        const isCommunityCreator = community.adminId === request.adminUserId;

        if (!isAdmin && !isCommunityCreator) {
            throw new ForbiddenError('Only admins or community creators can edit communities');
        }

        // 4. Selective update - only update provided fields (entities are immutable)
        const updatedCommunityData = {
            ...community.toJSON(),
            name: request.name !== undefined ? request.name : community.name,
            description: request.description !== undefined ? request.description : community.description,
            category: request.category !== undefined ? request.category : community.category,
            credits_cost: request.creditsCost !== undefined ? request.creditsCost : community.creditsCost,
            credits_period: request.creditsPeriod !== undefined ? request.creditsPeriod : community.creditsPeriod,
            is_active: request.isActive !== undefined ? request.isActive : community.isActive,
            updated_at: new Date(),
        };

        // 4. Update community in repository
        const updatedCommunity = await this.communityRepository.update(
            request.communityId,
            Community.fromDatabaseRow(updatedCommunityData)
        );

        // 5. Return updated community DTO
        return this.communityMapper.toDTO(updatedCommunity);
    }
}
