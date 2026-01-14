import { DeleteCommunityRequestDTO } from '../../dto/admin/DeleteCommunityRequestDTO';

/**
 * Interface for Delete Community Use Case (Admin)
 * Following Interface Segregation Principle - small, focused interface
 */
export interface IDeleteCommunityUseCase {
    execute(request: DeleteCommunityRequestDTO): Promise<{ message: string }>;
}
