import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAdminSkillMapper } from '../../mappers/interfaces/IAdminSkillMapper';
import { IAdminListSkillsUseCase } from './interfaces/IAdminListSkillsUseCase';
import { AdminListSkillsRequestDTO, AdminListSkillsRequestSchema } from '../../dto/admin/AdminListSkillsRequestDTO';
import { AdminListSkillsResponseDTO } from '../../dto/admin/AdminListSkillsResponseDTO';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class AdminListSkillsUseCase implements IAdminListSkillsUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
        @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
        @inject(TYPES.IAdminSkillMapper) private adminSkillMapper: IAdminSkillMapper
    ) { }

    async execute(request: AdminListSkillsRequestDTO): Promise<AdminListSkillsResponseDTO> {
        // Validate request
        const validatedRequest = AdminListSkillsRequestSchema.parse(request);

        // Verify admin user
        const adminUser = await this.userRepository.findById(validatedRequest.adminUserId);
        if (!adminUser || adminUser.role !== UserRole.ADMIN) {
            throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }

        // Get paginated skills from repository
        const result = await this.skillRepository.findAllAdminWithPagination({
            page: validatedRequest.page,
            limit: validatedRequest.limit,
            search: validatedRequest.search,
            status: validatedRequest.status,
            isBlocked: validatedRequest.isBlocked,
        });

        // Get unique provider IDs
        const providerIds = [...new Set(result.skills.map(s => s.providerId))];
        const providers = await this.userRepository.findByIds(providerIds);
        const providersMap = new Map(providers.map(p => [p.id, p]));

        // Map to DTOs
        const skillDTOs = result.skills.map(skill => {
            const provider = providersMap.get(skill.providerId);
            if (!provider) {
                throw new Error(`Provider not found for skill ${skill.id}`);
            }
            return this.adminSkillMapper.toDTO(skill, provider);
        });

        return {
            skills: skillDTOs,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.page < result.totalPages,
            hasPreviousPage: result.page > 1,
        };
    }
}
