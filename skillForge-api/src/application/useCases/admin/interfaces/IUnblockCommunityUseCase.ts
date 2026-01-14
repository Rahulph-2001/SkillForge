import { UnblockCommunityRequestDTO } from '../../../dto/admin/UnblockCommunityRequestDTO';

/**
 * Interface for Unblock Community Use Case (Admin)
 * Following Interface Segregation Principle - small, focused interface
 */
export interface IUnblockCommunityUseCase {
    execute(request: UnblockCommunityRequestDTO): Promise<{ message: string }>;
}
