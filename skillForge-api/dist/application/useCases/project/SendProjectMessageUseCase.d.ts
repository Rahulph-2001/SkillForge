import { ISendProjectMessageUseCase } from './interfaces/ISendProjectMessageUseCase';
import { IProjectMessageRepository } from '../../../domain/repositories/IProjectMessageRepository';
import { IProjectMessageMapper } from '../../mappers/interfaces/IProjectMessageMapper';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { CreateProjectMessageRequestDTO, ProjectMessageResponseDTO } from '../../dto/project/ProjectMessageDTO';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
export declare class SendProjectMessageUseCase implements ISendProjectMessageUseCase {
    private readonly messageRepository;
    private readonly projectRepository;
    private readonly messageMapper;
    private readonly socketService;
    constructor(messageRepository: IProjectMessageRepository, projectRepository: IProjectRepository, messageMapper: IProjectMessageMapper, socketService: IWebSocketService);
    execute(currentUserId: string, data: CreateProjectMessageRequestDTO): Promise<ProjectMessageResponseDTO>;
}
//# sourceMappingURL=SendProjectMessageUseCase.d.ts.map