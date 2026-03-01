import { type CommunityMessage } from '../../../../domain/entities/CommunityMessage';
import { type SendMessageDTO } from '../../../dto/community/SendMessageDTO';

export interface ISendMessageUseCase {
  execute(
    userId: string,
    dto: SendMessageDTO,
    file?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<CommunityMessage>;
}

