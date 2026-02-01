import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
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
export declare class UpdateCommunityByAdminUseCase implements IUpdateCommunityByAdminUseCase {
    private readonly userRepository;
    private readonly communityRepository;
    private readonly communityMapper;
    constructor(userRepository: IUserRepository, communityRepository: ICommunityRepository, communityMapper: ICommunityMapper);
    execute(request: UpdateCommunityByAdminRequestDTO): Promise<CommunityResponseDTO>;
}
//# sourceMappingURL=UpdateCommunityByAdminUseCase.d.ts.map