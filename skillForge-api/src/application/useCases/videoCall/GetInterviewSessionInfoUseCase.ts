import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetInterviewSessionInfoUseCase } from './interfaces/IGetInterviewSessionInfoUseCase';
import { SessionInfoDTO } from '../../dto/videoCall/SessionInfoDTO';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetInterviewSessionInfoUseCase implements IGetInterviewSessionInfoUseCase {
  constructor(
    @inject(TYPES.IInterviewRepository) private interviewRepository: IInterviewRepository,
    @inject(TYPES.IProjectApplicationRepository) private applicationRepository: IProjectApplicationRepository,
    @inject(TYPES.IProjectRepository) private projectRepository: IProjectRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) { }

  async execute(interviewId: string): Promise<SessionInfoDTO> {
    const interview = await this.interviewRepository.findById(interviewId);
    if (!interview) throw new NotFoundError('Interview not found');

    const application = await this.applicationRepository.findById(interview.applicationId);
    if (!application) throw new NotFoundError('Application not found');

    const project = await this.projectRepository.findById(application.projectId);
    if (!project) throw new NotFoundError('Project not found');

    const client = await this.userRepository.findById(project.clientId);
    const applicant = await this.userRepository.findById(application.applicantId);

    // Map to SessionInfoDTO structure expected by frontend
    return {
      scheduledAt: interview.scheduledAt,
      duration: interview.durationMinutes,
      status: interview.status,
      providerId: client!.id, // Treating client as "provider"/host
      providerName: client!.name,
      providerAvatar: client!.avatarUrl,
      learnerName: applicant!.name,
      skillTitle: `Interview: ${project.title}`,
      meetingLink: interview.meetingLink
    };
  }
}
