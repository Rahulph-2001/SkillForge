import { UpdateCommunityByAdminRequestDTO } from '../../../dto/admin/UpdateCommunityByAdminRequestDTO';
import { CommunityResponseDTO } from '../../../dto/community/CommunityResponseDTO';
/**
 * Interface for Update Community By Admin Use Case
 * Following Interface Segregation Principle - small, focused interface
 */
export interface IUpdateCommunityByAdminUseCase {
    execute(request: UpdateCommunityByAdminRequestDTO): Promise<CommunityResponseDTO>;
}
//# sourceMappingURL=IUpdateCommunityByAdminUseCase.d.ts.map