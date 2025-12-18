import { ICommunityMessageMapper } from './interfaces/ICommunityMessageMapper';
import { CommunityMessage } from '../../domain/entities/CommunityMessage';
import { MessageResponseDTO } from '../dto/community/MessageResponseDTO';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ICommunityMessageRepository } from '../../domain/repositories/ICommunityMessageRepository';
export declare class CommunityMessageMapper implements ICommunityMessageMapper {
    private readonly userRepository;
    private readonly messageRepository;
    constructor(userRepository: IUserRepository, messageRepository: ICommunityMessageRepository);
    toDTO(message: CommunityMessage): Promise<MessageResponseDTO>;
    toDTOList(messages: CommunityMessage[]): Promise<MessageResponseDTO[]>;
}
//# sourceMappingURL=CommunityMessageMapper.d.ts.map