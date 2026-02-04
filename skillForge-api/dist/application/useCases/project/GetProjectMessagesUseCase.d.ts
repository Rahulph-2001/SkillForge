import { IGetProjectMessagesUseCase } from './interfaces/IGetProjectMessagesUseCase';
import { IProjectMessageRepository } from '../../../domain/repositories/IProjectMessageRepository';
import { IProjectMessageMapper } from '../../mappers/interfaces/IProjectMessageMapper';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ProjectMessageResponseDTO } from '../../dto/project/ProjectMessageDTO';
export declare class GetProjectMessagesUseCase implements IGetProjectMessagesUseCase {
    private readonly messageRepository;
    private readonly projectRepository;
    private readonly messageMapper;
    constructor(messageRepository: IProjectMessageRepository, projectRepository: IProjectRepository, messageMapper: IProjectMessageMapper);
    execute(currentUserId: string, projectId: string): Promise<ProjectMessageResponseDTO[]>;
}
//# sourceMappingURL=GetProjectMessagesUseCase.d.ts.map