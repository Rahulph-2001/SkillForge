import { type CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { type MessageResponseDTO } from '../../dto/community/MessageResponseDTO';


export interface ICommunityMessageMapper {
  toDTO(message: CommunityMessage): Promise<MessageResponseDTO>;
  toDTOList(messages: CommunityMessage[]): Promise<MessageResponseDTO[]>;
}