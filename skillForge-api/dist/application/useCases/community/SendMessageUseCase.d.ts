import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { SendMessageDTO } from '../../dto/community/SendMessageDTO';
export interface ISendMessageUseCase {
    execute(userId: string, dto: SendMessageDTO, file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<CommunityMessage>;
}
export declare class SendMessageUseCase implements ISendMessageUseCase {
    private readonly messageRepository;
    private readonly communityRepository;
    private readonly s3Service;
    private readonly webSocketService;
    constructor(messageRepository: ICommunityMessageRepository, communityRepository: ICommunityRepository, s3Service: IS3Service, webSocketService: IWebSocketService);
    execute(userId: string, dto: SendMessageDTO, file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<CommunityMessage>;
}
//# sourceMappingURL=SendMessageUseCase.d.ts.map