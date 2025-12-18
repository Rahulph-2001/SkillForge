import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
export interface IGetCommunityMessagesUseCase {
    execute(userId: string, communityId: string, limit?: number, offset?: number): Promise<CommunityMessage[]>;
}
export declare class GetCommunityMessagesUseCase implements IGetCommunityMessagesUseCase {
    private readonly messageRepository;
    private readonly communityRepository;
    constructor(messageRepository: ICommunityMessageRepository, communityRepository: ICommunityRepository);
    execute(userId: string, communityId: string, limit?: number, offset?: number): Promise<Community>;
    Message: any;
    []: any;
}
//# sourceMappingURL=GetCommunityMessagesUseCase.d.ts.map