import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { MessageResponseDTO } from '../../dto/community/MessageResponseDTO';
export interface ICommunityMessageMapper {
    toDTO(message: CommunityMessage): Promise<MessageResponseDTO>;
    toDTOList(messages: CommunityMessage[]): Promise<MessageResponseDTO[]>;
}
//# sourceMappingURL=ICommunityMessageMapper.d.ts.map