import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository, AdminListProjectsFilters } from '../../../domain/repositories/IProjectRepository';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAdminListProjectsUseCase } from './interfaces/IAdminListProjectsUseCase';
import { AdminListProjectsRequestDTO, AdminListProjectsResponseDTO, AdminProjectDTO } from '../../dto/admin/AdminProjectDTO';
import { ProjectStatus } from '../../../domain/entities/Project';
import { ProjectPaymentRequestStatus } from '../../../domain/entities/ProjectPaymentRequest';

@injectable()
export class AdminListProjectsUseCase implements IAdminListProjectsUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IProjectPaymentRequestRepository) private readonly paymentRequestRepository: IProjectPaymentRequestRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
    ) { }

    async execute(dto: AdminListProjectsRequestDTO): Promise<AdminListProjectsResponseDTO> {
        // Map status string to ProjectStatus enum if provided
        let statusFilter: ProjectStatus | undefined;
        if (dto.status) {
            switch (dto.status) {
                case 'Open': statusFilter = ProjectStatus.OPEN; break;
                case 'In_Progress': statusFilter = ProjectStatus.IN_PROGRESS; break;
                case 'Pending_Completion': statusFilter = ProjectStatus.PENDING_COMPLETION; break;
                case 'Payment_Pending': statusFilter = ProjectStatus.PAYMENT_PENDING; break;
                case 'Refund_Pending': statusFilter = ProjectStatus.REFUND_PENDING; break;
                case 'Completed': statusFilter = ProjectStatus.COMPLETED; break;
                case 'Cancelled': statusFilter = ProjectStatus.CANCELLED; break;
            }
        }

        const filters: AdminListProjectsFilters = {
            page: dto.page,
            limit: dto.limit,
            search: dto.search,
            status: statusFilter,
            category: dto.category,
            isSuspended: dto.isSuspended,
            includeCreator: true,
            includeContributor: true
        };

        const result = await this.projectRepository.findAllAdmin(filters);

        // Get pending payment requests for these projects
        const pendingRequests = await this.paymentRequestRepository.findPending();
        const pendingProjectIds = new Set(pendingRequests.map(r => r.projectId));

        // Map projects to DTOs with creator and contributor info
        const projectDTOs: AdminProjectDTO[] = [];

        for (const project of result.projects) {
            // Get creator info
            const creator = await this.userRepository.findById(project.clientId);
            if (!creator) continue;

            // Get contributor info if exists
            let contributor = null;
            if (project.acceptedContributor) {
                contributor = {
                    id: project.acceptedContributor.id,
                    name: project.acceptedContributor.name,
                    avatarUrl: project.acceptedContributor.avatarUrl || null
                };
            }

            projectDTOs.push({
                id: project.id!,
                title: project.title,
                description: project.description,
                category: project.category,
                tags: project.tags,
                budget: project.budget,
                duration: project.duration,
                deadline: project.deadline ?? null,
                status: project.status,
                applicationsCount: project.applicationsCount || 0,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                creator: {
                    id: creator.id,
                    name: creator.name,
                    email: creator.email.value,
                    avatarUrl: creator.avatarUrl || null
                },
                contributor,
                hasPendingPaymentRequest: pendingProjectIds.has(project.id!),
                // Suspension fields - defaults for pre-migration compatibility
                isSuspended: project.isSuspended ?? false,
                suspendedAt: project.suspendedAt ?? null,
                suspendReason: project.suspendReason ?? null
            });
        }

        return {
            projects: projectDTOs,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };
    }
}
