import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetInterviewUseCase } from './interfaces/IGetInterviewUseCase';
import { InterviewResponseDTO } from '../../dto/interview/ScheduleInterviewDTO';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IInterviewMapper } from '../../mappers/interfaces/IInterviewMapper';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class GetInterviewUseCase implements IGetInterviewUseCase {
    constructor(
        @inject(TYPES.IInterviewRepository) private interviewRepository: IInterviewRepository,
        @inject(TYPES.IProjectApplicationRepository) private applicationRepository: IProjectApplicationRepository,
        @inject(TYPES.IProjectRepository) private projectRepository: IProjectRepository,
        @inject(TYPES.IInterviewMapper) private mapper: IInterviewMapper
    ) { }

    async execute(userId: string, applicationId: string): Promise<InterviewResponseDTO[]> {
        const application = await this.applicationRepository.findById(applicationId);
        if (!application) {
            throw new NotFoundError('Application not found');
        }

        const project = await this.projectRepository.findById(application.projectId);
        if (!project) {
            throw new NotFoundError(ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }

        if (project.clientId !== userId && application.applicantId !== userId) {
            throw new ForbiddenError('You are not authorized to view interviews for this application');
        }

        const interviews = await this.interviewRepository.findByApplicationId(applicationId);
        return interviews.map(i => this.mapper.toResponseDTO(i));
    }
}
