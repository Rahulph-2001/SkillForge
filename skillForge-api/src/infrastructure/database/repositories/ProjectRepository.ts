import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IProjectRepository, ListProjectsFilters, ListProjectsResult } from '../../../domain/repositories/IProjectRepository';
import { Project, ProjectStatus } from '../../../domain/entities/Project';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {
  constructor(@inject(TYPES.Database) db: Database) {
    super(db, 'project');
  }

  // --- Helper: Mapper ---
  private mapToDomain(data: any): Project {
    // Map Prisma enum value to ProjectStatus enum
    let status: ProjectStatus;
    switch (data.status) {
      case 'Open':
        status = ProjectStatus.OPEN;
        break;
      case 'In_Progress':
        status = ProjectStatus.IN_PROGRESS;
        break;
      case 'Completed':
        status = ProjectStatus.COMPLETED;
        break;
      case 'Cancelled':
        status = ProjectStatus.CANCELLED;
        break;
      case 'Pending_Completion':
        status = ProjectStatus.PENDING_COMPLETION;
        break;
      default:
        status = ProjectStatus.OPEN; // Default fallback
    }

    // Find accepted applicant if present
    const acceptedApp = data.applications?.find((app: any) => app.status === 'ACCEPTED');
    const acceptedContributor = acceptedApp?.applicant ? {
      id: acceptedApp.applicant.id,
      name: acceptedApp.applicant.name,
      avatarUrl: acceptedApp.applicant.avatarUrl
    } : undefined;

    return Project.create({
      id: data.id,
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags || [],
      budget: Number(data.budget),
      duration: data.duration,
      deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : null,
      status: status,
      paymentId: data.paymentId,
      applicationsCount: data.applicationsCount || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      client: data.client ? {
        id: data.client.id,
        name: data.client.name,
        avatarUrl: data.client.avatarUrl
      } : undefined,
      acceptedContributor,
    });
  }

  // --- Read Operations ---

  async findById(projectId: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });

    return project ? this.mapToDomain(project) : null;
  }

  async findByClientId(clientId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { clientId, isDeleted: false },
      include: {
        applications: {
          where: { status: 'ACCEPTED' },
          include: { applicant: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p) => this.mapToDomain(p));
  }

  async findByClientIdAndStatus(clientId: string, status: ProjectStatus): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { clientId, status, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p) => this.mapToDomain(p));
  }

  async findByPaymentId(paymentId: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { paymentId, isDeleted: false },
    });

    return project ? this.mapToDomain(project) : null;
  }

  async findContributingProjects(userId: string): Promise<Project[]> {
    const applications = await this.prisma.projectApplication.findMany({
      where: {
        applicantId: userId,
        status: 'ACCEPTED',
      },
      include: {
        project: {
          include: {
            client: true,
          }
        },
      },
    });

    const projects = applications
      .map((app) => app.project)
      .filter((project) => project !== null && (project.status === 'In_Progress' || project.status === 'Open' || project.status === 'Pending_Completion'));

    return projects.map((p) => this.mapToDomain(p));
  }

  // --- List Operations ---

  async listProjects(filters: ListProjectsFilters): Promise<ListProjectsResult> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    console.log('[ProjectRepository] Listing projects with filters:', filters);

    // Build where clause
    const where: any = {
      isDeleted: false,
    };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    // Get total count
    const total = await this.prisma.project.count({ where });

    // Get projects
    const projects = await this.prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      projects: projects.map((p) => this.mapToDomain(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // --- Write Operations ---

  async create(project: Project): Promise<Project> {
    const data = project.toJSON();
    // Map ProjectStatus enum to Prisma enum value
    let prismaStatus: string;
    switch (project.status) {
      case ProjectStatus.OPEN:
        prismaStatus = 'Open';
        break;
      case ProjectStatus.IN_PROGRESS:
        prismaStatus = 'In_Progress';
        break;
      case ProjectStatus.COMPLETED:
        prismaStatus = 'Completed';
        break;
      case ProjectStatus.CANCELLED:
        prismaStatus = 'Cancelled';
        break;
      case ProjectStatus.PENDING_COMPLETION:
        prismaStatus = 'Pending_Completion';
        break;
      default:
        prismaStatus = 'Open';
    }


    const created = await this.prisma.project.create({
      data: {
        id: project.id,
        clientId: project.clientId,
        title: project.title,
        description: project.description,
        category: project.category,
        tags: project.tags,
        budget: project.budget,
        duration: project.duration,
        deadline: project.deadline ? new Date(project.deadline) : null,
        status: prismaStatus as any,
        paymentId: project.paymentId,
        applicationsCount: project.applicationsCount || 0,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });

    return this.mapToDomain(created);
  }

  async update(project: Project): Promise<Project> {
    // Map ProjectStatus enum to Prisma enum value
    let prismaStatus: string;
    switch (project.status) {
      case ProjectStatus.OPEN:
        prismaStatus = 'Open';
        break;
      case ProjectStatus.IN_PROGRESS:
        prismaStatus = 'In_Progress';
        break;
      case ProjectStatus.COMPLETED:
        prismaStatus = 'Completed';
        break;
      case ProjectStatus.CANCELLED:
        prismaStatus = 'Cancelled';
        break;
      case ProjectStatus.PENDING_COMPLETION:
        prismaStatus = 'Pending_Completion';
        break;
      default:
        prismaStatus = 'Open';
    }

    const updated = await this.prisma.project.update({
      where: { id: project.id },
      data: {
        title: project.title,
        description: project.description,
        category: project.category,
        tags: project.tags,
        budget: project.budget,
        duration: project.duration,
        deadline: project.deadline ? new Date(project.deadline) : null,
        status: prismaStatus as any,
        applicationsCount: project.applicationsCount || 0,
        updatedAt: new Date(),
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await super.delete(id);
  }

  async updateStatus(projectId: string, status: ProjectStatus): Promise<Project> {
    // Map ProjectStatus enum to Prisma enum value
    let prismaStatus: string;
    switch (status) {
      case ProjectStatus.OPEN:
        prismaStatus = 'Open';
        break;
      case ProjectStatus.IN_PROGRESS:
        prismaStatus = 'In_Progress';
        break;
      case ProjectStatus.COMPLETED:
        prismaStatus = 'Completed';
        break;
      case ProjectStatus.CANCELLED:
        prismaStatus = 'Cancelled';
        break;
      case ProjectStatus.PENDING_COMPLETION:
        prismaStatus = 'Pending_Completion';
        break;
      default:
        prismaStatus = 'Open';
    }

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: prismaStatus as any,
        updatedAt: new Date(),
      },
    });

    return this.mapToDomain(updated);
  }

  async incrementApplicationsCount(projectId: string): Promise<Project> {
    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        applicationsCount: { increment: 1 },
        updatedAt: new Date(),
      },
    });

    return this.mapToDomain(updated);
  }
}