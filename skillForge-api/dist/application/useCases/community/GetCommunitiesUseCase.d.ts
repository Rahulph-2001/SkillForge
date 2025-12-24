import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
export interface IGetCommunitiesUseCase {
    execute(filters?: {
        category?: string;
    }, userId?: string): Promise<Community[]>;
}
export declare class GetCommunitiesUseCase implements IGetCommunitiesUseCase {
    private readonly communityRepository;
    constructor(communityRepository: ICommunityRepository);
    execute(filters?: {
        category?: string;
    }, userId?: string): Promise<Community[]>;
}
//# sourceMappingURL=GetCommunitiesUseCase.d.ts.map