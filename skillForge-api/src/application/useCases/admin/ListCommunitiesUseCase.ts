import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IListCommunitiesUseCase } from './interfaces/IListCommunitiesUseCase';
import { ListCommunitiesRequestDTO } from '../../dto/admin/ListCommunitiesRequestDTO';
import { ListCommunitiesResponseDTO } from '../../dto/admin/ListCommunitiesResponseDTO';

@injectable()
export class ListCommunitiesUseCase implements IListCommunitiesUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
        @inject(TYPES.ICommunityMapper) private readonly communityMapper: ICommunityMapper,
        @inject(TYPES.IPaginationService) private readonly paginationService: IPaginationService
    ) { }

    async execute(request: ListCommunitiesRequestDTO): Promise<ListCommunitiesResponseDTO> {
        // 1. Verify admin user
        const adminUser = await this.userRepository.findById(request.adminUserId);
        if (!adminUser || adminUser.role !== UserRole.ADMIN) {
            throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }

        // 2. Create pagination params
        const paginationParams = this.paginationService.createParams(request.page, request.limit);

        // 2. Build filters for repository query
        const filters: { search?: string; category?: string; isActive?: boolean } = {};

        if (request.search) {
            filters.search = request.search;
        }

        if (request.category) {
            filters.category = request.category;
        }

        // Admin can see ALL communities (including blocked ones)
        // Do not filter by isActive - show both active and blocked

        // 3. Fetch communities with paginationed communities
        const { communities, total } = await this.communityRepository.findAllWithPagination(
            filters,
            paginationParams
        );

        // 5. Map communities to DTOs
        const communityDTOs = await this.communityMapper.toDTOList(communities);

        // 6. Calculate statistics (fetch all communities for accurate stats)
        const allCommunities = await this.communityRepository.findAll();
        const totalMembers = allCommunities.reduce((sum, community) => sum + community.membersCount, 0);
        const avgMembershipCost = allCommunities.length > 0
            ? allCommunities.reduce((sum, community) => sum + community.creditsCost, 0) / allCommunities.length
            : 0;

        // 7. Create pagination result
        const paginationResult = this.paginationService.createResult(
            communityDTOs,
            total,
            request.page,
            request.limit
        );

        // 8. Return response
        return {
            communities: communityDTOs,
            pagination: {
                total: paginationResult.total,
                page: paginationResult.page,
                limit: paginationResult.limit,
                totalPages: paginationResult.totalPages,
                hasNextPage: paginationResult.hasNextPage,
                hasPreviousPage: paginationResult.hasPreviousPage,
            },
            stats: {
                totalCommunities: allCommunities.length,
                totalMembers,
                avgMembershipCost: parseFloat(avgMembershipCost.toFixed(1)),
            },
        };
    }
}
