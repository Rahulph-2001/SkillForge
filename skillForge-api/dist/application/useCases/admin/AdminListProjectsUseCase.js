"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListProjectsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Project_1 = require("../../../domain/entities/Project");
let AdminListProjectsUseCase = class AdminListProjectsUseCase {
    constructor(projectRepository, paymentRequestRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.paymentRequestRepository = paymentRequestRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        // Map status string to ProjectStatus enum if provided
        let statusFilter;
        if (dto.status) {
            switch (dto.status) {
                case 'Open':
                    statusFilter = Project_1.ProjectStatus.OPEN;
                    break;
                case 'In_Progress':
                    statusFilter = Project_1.ProjectStatus.IN_PROGRESS;
                    break;
                case 'Pending_Completion':
                    statusFilter = Project_1.ProjectStatus.PENDING_COMPLETION;
                    break;
                case 'Payment_Pending':
                    statusFilter = Project_1.ProjectStatus.PAYMENT_PENDING;
                    break;
                case 'Refund_Pending':
                    statusFilter = Project_1.ProjectStatus.REFUND_PENDING;
                    break;
                case 'Completed':
                    statusFilter = Project_1.ProjectStatus.COMPLETED;
                    break;
                case 'Cancelled':
                    statusFilter = Project_1.ProjectStatus.CANCELLED;
                    break;
            }
        }
        const filters = {
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
        const projectDTOs = [];
        for (const project of result.projects) {
            // Get creator info
            const creator = await this.userRepository.findById(project.clientId);
            if (!creator)
                continue;
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
                id: project.id,
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
                hasPendingPaymentRequest: pendingProjectIds.has(project.id),
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
};
exports.AdminListProjectsUseCase = AdminListProjectsUseCase;
exports.AdminListProjectsUseCase = AdminListProjectsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectPaymentRequestRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminListProjectsUseCase);
//# sourceMappingURL=AdminListProjectsUseCase.js.map