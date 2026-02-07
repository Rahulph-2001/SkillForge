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
exports.ListProjectsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let ListProjectsUseCase = class ListProjectsUseCase {
    constructor(projectRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async execute(filters) {
        // Map DTO filters to repository filters
        const repositoryFilters = {
            search: filters.search,
            category: filters.category,
            status: filters.status,
            isSuspended: false, // Don't show suspended projects in public list
            page: filters.page || 1,
            limit: filters.limit || 20,
        };
        // Get projects from repository
        const result = await this.projectRepository.listProjects(repositoryFilters);
        // Collect client IDs (only if we have projects)
        const clientIds = result.projects.length > 0
            ? [...new Set(result.projects.map(p => p.clientId))]
            : [];
        // Fetch clients (only if we have client IDs)
        const clients = clientIds.length > 0
            ? await this.userRepository.findByIds(clientIds)
            : [];
        const clientsMap = new Map(clients.map(c => [c.id, c]));
        // Map to response DTOs with client info
        const projectDTOs = result.projects.map(project => {
            const client = clientsMap.get(project.clientId);
            if (!client) {
                // Log error but don't throw - return project without client info to avoid breaking the entire list
                console.error(`Client not found for project ${project.id}`);
                // Return project with minimal client info
                return {
                    id: project.id,
                    clientId: project.clientId,
                    title: project.title,
                    description: project.description,
                    category: project.category,
                    tags: project.tags,
                    budget: project.budget,
                    duration: project.duration,
                    deadline: project.deadline || undefined,
                    status: project.status,
                    paymentId: project.paymentId || undefined,
                    applicationsCount: project.applicationsCount,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt,
                    client: {
                        name: 'Unknown User',
                        avatar: undefined,
                        rating: undefined,
                        isVerified: false,
                    },
                };
            }
            return {
                id: project.id,
                clientId: project.clientId,
                title: project.title,
                description: project.description,
                category: project.category,
                tags: project.tags,
                budget: project.budget,
                duration: project.duration,
                deadline: project.deadline || undefined,
                status: project.status,
                paymentId: project.paymentId || undefined,
                applicationsCount: project.applicationsCount,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                client: {
                    name: client.name,
                    avatar: client.avatarUrl || undefined,
                    rating: client.rating || undefined,
                    isVerified: client.verification?.email_verified || false,
                },
            };
        });
        return {
            projects: projectDTOs,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
};
exports.ListProjectsUseCase = ListProjectsUseCase;
exports.ListProjectsUseCase = ListProjectsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], ListProjectsUseCase);
//# sourceMappingURL=ListProjectsUseCase.js.map