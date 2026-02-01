import { injectable } from 'inversify';
import { ProjectApplication } from '../../domain/entities/ProjectApplication';
import { ProjectApplicationResponseDTO } from '../dto/projectApplication/ProjectApplicationResponseDTO';
import { IProjectApplicationMapper, ApplicantInfo } from './interfaces/IProjectApplicationMapper';

@injectable()
export class ProjectApplicationMapper implements IProjectApplicationMapper {
  public toResponseDTO(application: ProjectApplication, applicant?: ApplicantInfo): ProjectApplicationResponseDTO {
    return {
      id: application.id,
      projectId: application.projectId,
      applicantId: application.applicantId,
      coverLetter: application.coverLetter,
      proposedBudget: application.proposedBudget,
      proposedDuration: application.proposedDuration,
      status: application.status,
      matchScore: application.matchScore,
      matchAnalysis: application.matchAnalysis,
      applicant: applicant ? {
        id: applicant.id,
        name: applicant.name,
        avatarUrl: applicant.avatarUrl,
        rating: applicant.rating,
        reviewCount: applicant.reviewCount,
        skillsOffered: applicant.skillsOffered,
      } : undefined,
      project: application.project ? {
        id: application.project.id,
        title: application.project.title,
        budget: application.project.budget,
        duration: application.project.duration,
      } : undefined,
      interviews: application.interviews ? application.interviews.map(i => ({
        id: i.id,
        scheduledAt: i.scheduledAt,
        durationMinutes: i.durationMinutes,
        status: i.status,
        videoCallRoomId: i.videoCallRoom?.id,
      })) : [],
      appliedAt: application.createdAt,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      reviewedAt: application.reviewedAt,
    };
  }

  public toResponseDTOList(
    applications: ProjectApplication[],
    applicantsMap?: Map<string, ApplicantInfo>
  ): ProjectApplicationResponseDTO[] {
    return applications.map(app =>
      this.toResponseDTO(app, applicantsMap?.get(app.applicantId))
    );
  }
}