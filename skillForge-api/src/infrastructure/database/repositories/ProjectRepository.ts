import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IProjectRepository, ListProjectsFilters, ListProjectsResult } from '../../../domain/repositories/IProjectRepository';
import { Project, ProjectStatus } from '../../../domain/entities/Project';
import { Database } from '../Database';

@injectable()
export class ProjectRepository implements IProjectRepository {
  private prisma: PrismaClient;

  constructor(@inject(TYPES.Database) db: Database) {
    this.prisma = db.getClient();
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
      default:
        status = ProjectStatus.OPEN; // Default fallback
    }

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

    if (filters.status) {
      // Convert ProjectStatus enum to Prisma enum value
      const prismaStatus = filters.status as unknown as string;
      where.status = prismaStatus as any;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } },
      ];
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

    const totalPages = Math.ceil(total / limit);

    console.log('[ProjectRepository] Found projects:', {
      total,
      returned: projects.length,
      page,
      totalPages,
    });

    return {
      projects: projects.map((p) => this.mapToDomain(p)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  // --- Standard CRUD ---

  async create(project: Project): Promise<Project> {
    const projectData = project.toObject();

    // Convert ProjectStatus enum to Prisma enum value (string)
    // ProjectStatus.OPEN = 'Open', ProjectStatus.IN_PROGRESS = 'In_Progress', etc.
    const prismaStatus = projectData.status as unknown as string;

    try {
      console.log('[ProjectRepository] Creating project:', {
        id: projectData.id,
        title: projectData.title,
        clientId: projectData.clientId,
        paymentId: projectData.paymentId,
      });

      const created = await this.prisma.project.create({
        data: {
          id: projectData.id!,
          clientId: projectData.clientId,
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          tags: projectData.tags,
          budget: projectData.budget,
          duration: projectData.duration,
          deadline: projectData.deadline ? new Date(projectData.deadline) : null,
          status: prismaStatus as any, // Cast to Prisma ProjectStatus enum type
          paymentId: projectData.paymentId || null,
          applicationsCount: projectData.applicationsCount || 0,
          isDeleted: false, // Explicitly set isDeleted to false
          createdAt: projectData.createdAt,
          updatedAt: projectData.updatedAt,
        },
      });

      console.log('[ProjectRepository] Project created successfully:', created.id);

      // Verify project can be queried back
      const verified = await this.prisma.project.findUnique({
        where: { id: created.id, isDeleted: false },
      });

      if (!verified) {
        console.error('[ProjectRepository] WARNING: Created project cannot be queried back!', created.id);
      } else {
        console.log('[ProjectRepository] Project verified in database with isDeleted:', verified.isDeleted);
      }

      return this.mapToDomain(created);
    } catch (error) {
      console.error('[ProjectRepository] Failed to create project:', {
        error: error instanceof Error ? error.message : error,
        projectData: {
          id: projectData.id,
          title: projectData.title,
          clientId: projectData.clientId,
        },
      });
      throw error;
    }
  }

  async update(project: Project): Promise<Project> {
    const projectData = project.toObject();

    // Convert ProjectStatus enum to Prisma enum value
    const prismaStatus = projectData.status as unknown as string;

    const updated = await this.prisma.project.update({
      where: { id: projectData.id },
      data: {
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        tags: projectData.tags,
        budget: projectData.budget,
        duration: projectData.duration,
        deadline: projectData.deadline ? new Date(projectData.deadline) : null,
        status: prismaStatus as any,
        applicationsCount: projectData.applicationsCount,
        updatedAt: projectData.updatedAt,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(projectId: string): Promise<void> {
    await this.prisma.project.update({
      where: { id: projectId },
      data: { isDeleted: true },
    });
  }

  // --- Status Updates ---

  async updateStatus(projectId: string, status: ProjectStatus): Promise<Project> {
    // Convert ProjectStatus enum to Prisma enum value
    const prismaStatus = status as unknown as string;

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: { status: prismaStatus as any, updatedAt: new Date() },
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

