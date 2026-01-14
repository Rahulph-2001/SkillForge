import { ListCommunitiesRequestDTO } from '../../dto/admin/ListCommunitiesRequestDTO';
import { ListCommunitiesResponseDTO } from '../../dto/admin/ListCommunitiesResponseDTO';

/**
 * Interface for List Communities Use Case (Admin)
 */
export interface IListCommunitiesUseCase {
    execute(request: ListCommunitiesRequestDTO): Promise<ListCommunitiesResponseDTO>;
}
