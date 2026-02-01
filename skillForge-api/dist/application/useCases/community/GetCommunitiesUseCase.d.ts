import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IPaginationResult } from '../../../domain/types/IPaginationParams';
import { IGetCommunitiesUseCase } from './interfaces/IGetCommunitiesUseCase';
export declare class GetCommunitiesUseCase implements IGetCommunitiesUseCase {
    private readonly communityRepository;
    private readonly paginationService;
    constructor(communityRepository: ICommunityRepository, paginationService: IPaginationService);
    execute(filters?: {
        category?: string;
        search?: string;
    }, userId?: string, page?: number, limit?: number): Promise<IPaginationResult<Community>>;
}
//# sourceMappingURL=GetCommunitiesUseCase.d.ts.map