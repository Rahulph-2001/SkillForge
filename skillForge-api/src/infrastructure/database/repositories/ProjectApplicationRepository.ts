import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { ProjectApplication, ProjectApplicationStatus, MatchAnalysis } from '../../../domain/entities/ProjectApplication';
import { PrismaClient } from '@prisma/client';

@injectable()
export class ProjectApplicationRepository
  extends BaseRepository<ProjectApplication>
  implements IProjectApplicationRepository {
  constructor(@inject(TYPES.Database) db: Database) {
    super(db, 'projectApplication');
  }

  async create(application: ProjectApplication): Promise<ProjectApplication> {
    const prisma = this.prisma as PrismaClient;
    const created = await prisma.projectApplication.create({
      data: {
        id: application.id,
        projectId: application.projectId,
        applicantId: application.applicantId,
        coverLetter: application.coverLetter,
        proposedBudget: application.proposedBudget,
        proposedDuration: application.proposedDuration,
        status: application.status,
        matchScore: application.matchScore,
        matchAnalysis: application.matchAnalysis as any,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        reviewedAt: application.reviewedAt,
      },
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<ProjectApplication | null> {
    const prisma = this.prisma as PrismaClient;
    const data = await prisma.projectApplication.findUnique({
      where: { id },
    });
    return data ? this.toDomain(data) : null;
  }

  async findByProjectId(projectId: string): Promise<ProjectApplication[]> {
    const prisma = this.prisma as PrismaClient;
    const data = await prisma.projectApplication.findMany({
      where: { projectId },
      orderBy: { matchScore: 'desc' },
    });
    return data.map((d: any) => this.toDomain(d));
  }

  async findByApplicantId(applicantId: string): Promise<ProjectApplication[]> {
    const prisma = this.prisma as PrismaClient;
    const data = await prisma.projectApplication.findMany({
      where: { applicantId },
      include: {
        project: true,
        interviews: true
      },
      orderBy: { createdAt: 'desc' },
    });
    return data.map((d: any) => this.toDomain(d));
  }

  async findByProjectAndApplicant(projectId: string, applicantId: string): Promise<ProjectApplication | null> {
    const prisma = this.prisma as PrismaClient;
    const data = await prisma.projectApplication.findUnique({
      where: {
        projectId_applicantId: { projectId, applicantId },
      },
    });
    return data ? this.toDomain(data) : null;
  }

  async findAcceptedByProject(projectId: string): Promise<ProjectApplication | null> {
    const prisma = this.prisma as PrismaClient;
    const data = await prisma.projectApplication.findFirst({
      where: {
        projectId,
        status: ProjectApplicationStatus.ACCEPTED
      },
    });
    return data ? this.toDomain(data) : null;
  }

  async findReceivedApplications(userId: string): Promise<ProjectApplication[]> {
    const prisma = this.prisma as PrismaClient;
    const data = await prisma.projectApplication.findMany({
      where: {
        project: {
          clientId: userId,
        },
      },
      include: {
        project: true,
        applicant: true,
        interviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return data.map((d: any) => this.toDomain(d));
  }

  async update(application: ProjectApplication): Promise<ProjectApplication> {
    const prisma = this.prisma as PrismaClient;
    const updated = await prisma.projectApplication.update({
      where: { id: application.id },
      data: {
        status: application.status,
        matchScore: application.matchScore,
        matchAnalysis: application.matchAnalysis as any,
        updatedAt: application.updatedAt,
        reviewedAt: application.reviewedAt,
      },
    });
    return this.toDomain(updated);
  }

  async updateStatus(id: string, status: ProjectApplicationStatus): Promise<ProjectApplication> {
    const prisma = this.prisma as PrismaClient;
    const updated = await prisma.projectApplication.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const prisma = this.prisma as PrismaClient;
    await prisma.projectApplication.delete({ where: { id } });
  }

  private toDomain(data: any): ProjectApplication {
    return new ProjectApplication({
      id: data.id,
      projectId: data.projectId,
      applicantId: data.applicantId,
      coverLetter: data.coverLetter,
      proposedBudget: data.proposedBudget ? Number(data.proposedBudget) : null,
      proposedDuration: data.proposedDuration,
      status: data.status as ProjectApplicationStatus,
      matchScore: data.matchScore ? Number(data.matchScore) : null,
      matchAnalysis: data.matchAnalysis as MatchAnalysis | null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      reviewedAt: data.reviewedAt,
      project: data.project,
      applicant: data.applicant,
      interviews: data.interviews,
    });
  }
}