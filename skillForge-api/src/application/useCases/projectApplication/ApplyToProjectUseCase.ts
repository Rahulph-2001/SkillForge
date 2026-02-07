import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IApplyToProjectUseCase } from './interfaces/IApplyToProjectUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IGeminiAIService, ApplicantProfile, ProjectDetails } from '../../../domain/services/IGeminiAIService';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { CreateProjectApplicationDTO } from '../../dto/projectApplication/CreateProjectApplicationDTO';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
import { ProjectApplication } from '../../../domain/entities/ProjectApplication';
import { ProjectStatus } from '../../../domain/entities/Project';
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class ApplyToProjectUseCase implements IApplyToProjectUseCase {
  constructor(
    @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository,
    @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
    @inject(TYPES.IGeminiAIService) private readonly geminiService: IGeminiAIService,
    @inject(TYPES.IProjectApplicationMapper) private readonly mapper: IProjectApplicationMapper,
    @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
  ) { }

  async execute(applicantId: string, dto: CreateProjectApplicationDTO): Promise<ProjectApplicationResponseDTO> {
    // 1. Validate project exists and is open
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT.NOT_FOUND);
    }
    if (project.status !== ProjectStatus.OPEN) {
      throw new ValidationError('Project is not accepting applications');
    }
    if (project.clientId === applicantId) {
      throw new ForbiddenError('Cannot apply to your own project');
    }

    // 2. Check for existing application
    const existingApplication = await this.applicationRepository.findByProjectAndApplicant(
      dto.projectId,
      applicantId
    );
    if (existingApplication) {
      throw new ValidationError('You have already applied to this project');
    }

    // 3. Get applicant profile for AI analysis
    const applicant = await this.userRepository.findById(applicantId);
    if (!applicant) {
      throw new NotFoundError('Applicant not found');
    }

    // 4. Get applicant's skills
    const skills = await this.skillRepository.findByProviderId(applicantId);
    const approvedSkills = skills.filter(s =>
      s.status === 'approved' &&
      s.verificationStatus === 'passed' &&
      !s.isBlocked &&
      !s.isAdminBlocked
    );

    // 5. Prepare data for AI analysis
    const applicantProfile: ApplicantProfile = {
      id: applicant.id,
      name: applicant.name,
      bio: applicant.bio,
      skills: approvedSkills.map(s => s.title),
      rating: applicant.rating,
      reviewCount: applicant.reviewCount,
      totalSessionsCompleted: applicant.totalSessionsCompleted,
      skillDetails: approvedSkills.map(s => ({
        title: s.title,
        category: s.category,
        level: s.level,
        rating: s.rating,
        totalSessions: s.totalSessions,
      })),
    };

    const projectDetails: ProjectDetails = {
      id: project.id!,
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      budget: Number(project.budget),
      duration: project.duration,
    };

    // 6. Run AI match analysis
    const matchAnalysis = await this.geminiService.analyzeApplicantMatch(
      projectDetails,
      applicantProfile,
      dto.coverLetter
    );

    // 7. Create application entity
    const application = new ProjectApplication({
      projectId: dto.projectId,
      applicantId,
      coverLetter: dto.coverLetter,
      proposedBudget: dto.proposedBudget,
      proposedDuration: dto.proposedDuration,
    });

    // 8. Set match score from AI analysis
    application.setMatchScore(matchAnalysis.overallScore, matchAnalysis);

    // 9. Save application
    const savedApplication = await this.applicationRepository.create(application);

    // 10. Increment project applications count
    await this.projectRepository.incrementApplicationsCount(dto.projectId);

    // 11. Notify project owner about new application
    await this.notificationService.send({
      userId: project.clientId,
      type: NotificationType.PROJECT_APPLICATION_RECEIVED,
      title: 'New Project Application',
      message: `${applicant.name} applied to your project "${project.title}"`,
      data: {
        projectId: project.id!,
        applicationId: savedApplication.id!,
        applicantId: applicantId,
        matchScore: matchAnalysis.overallScore
      },
    });

    // 12. Return response
    return this.mapper.toResponseDTO(savedApplication, {
      id: applicant.id,
      name: applicant.name,
      avatarUrl: applicant.avatarUrl,
      rating: applicant.rating,
      reviewCount: applicant.reviewCount,
      skillsOffered: approvedSkills.map(s => s.title),
    });
  }
}