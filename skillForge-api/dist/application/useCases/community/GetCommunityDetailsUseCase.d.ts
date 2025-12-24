import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
export interface IGetCommunityDetailsUseCase {
    execute(communityId: string, userId?: string): Promise<Community>;
}
export declare class GetCommunityDetailsUseCase implements IGetCommunityDetailsUseCase {
    private readonly communityRepository;
    constructor(communityRepository: ICommunityRepository);
    execute(communityId: string, userId?: string): Promise<Community>;
}
//# sourceMappingURL=GetCommunityDetailsUseCase.d.ts.map