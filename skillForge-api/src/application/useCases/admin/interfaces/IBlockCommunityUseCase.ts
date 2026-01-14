import { BlockCommunityRequestDTO } from '../../../dto/admin/BlockCommunityRequestDTO';

/**
 * Interface for Block Community Use Case (Admin)
 * Following Interface Segregation Principle - small, focused interface
 */
export interface IBlockCommunityUseCase {
    execute(request: BlockCommunityRequestDTO): Promise<{ message: string }>;
}
