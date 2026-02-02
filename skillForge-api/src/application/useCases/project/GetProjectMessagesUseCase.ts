
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetProjectMessagesUseCase } from './interfaces/IGetProjectMessagesUseCase';
import { IProjectMessageRepository } from '../../../domain/repositories/IProjectMessageRepository';
import { IProjectMessageMapper } from '../../mappers/interfaces/IProjectMessageMapper';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ProjectMessageResponseDTO } from '../../dto/project/ProjectMessageDTO';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class GetProjectMessagesUseCase implements IGetProjectMessagesUseCase {
    constructor(
        @inject(TYPES.IProjectMessageRepository) private readonly messageRepository: IProjectMessageRepository,
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IProjectMessageMapper) private readonly messageMapper: IProjectMessageMapper
    ) { }

    async execute(currentUserId: string, projectId: string): Promise<ProjectMessageResponseDTO[]> {
        // 1. Verify Project Exists
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundError(ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }

        // 2. Verify User is Participant
        const isClient = project.clientId === currentUserId;
        const isContributor = project.acceptedContributor?.id === currentUserId;

        // Allow admin to view messages? (Optional, but for now strict participant only)
        // If currentUserId has admin role? Check user entity or context.
        // For strictly "Client <-> Contributor", limit to them.
        if (!isClient && !isContributor) {
            throw new ForbiddenError('You are not a participant in this project');
        }

        // 3. Fetch Messages
        const messages = await this.messageRepository.findByProjectId(projectId);

        // 4. Mark as Read (if recipient is viewing)
        // Optimization: Could be done asynchronously or in a separate call
        // For simplicity: If I am receiving messages, mark UNREAD messages from OTHER as read.
        // Implementation detail: Repository markAllAsRead
        await this.messageRepository.markAllAsRead(projectId, currentUserId);

        // 5. Map to DTOs
        return messages.map(msg => this.messageMapper.toResponseDTO(msg, currentUserId));
    }
}
