import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Database } from '../../../infrastructure/database/Database';
import { IRemoveCommunityMemberUseCase } from './interfaces/IRemoveCommunityMemberUseCase';
export declare class RemoveCommunityMemberUseCase implements IRemoveCommunityMemberUseCase {
    private readonly communityRepository;
    private readonly database;
    constructor(communityRepository: ICommunityRepository, database: Database);
    execute(adminId: string, communityId: string, memberId: string): Promise<void>;
}
//# sourceMappingURL=RemoveCommunityMemberUseCase.d.ts.map