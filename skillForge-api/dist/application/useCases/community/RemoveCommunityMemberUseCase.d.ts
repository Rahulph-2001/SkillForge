import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { PrismaClient } from '@prisma/client';
export interface IRemoveCommunityMemberUseCase {
    execute(adminId: string, communityId: string, memberId: string): Promise<void>;
}
export declare class RemoveCommunityMemberUseCase implements IRemoveCommunityMemberUseCase {
    private readonly communityRepository;
    private readonly prisma;
    constructor(communityRepository: ICommunityRepository, prisma: PrismaClient);
    execute(adminId: string, communityId: string, memberId: string): Promise<void>;
}
//# sourceMappingURL=RemoveCommunityMemberUseCase.d.ts.map