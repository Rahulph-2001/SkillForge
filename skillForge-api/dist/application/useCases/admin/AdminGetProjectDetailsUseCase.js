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
exports.AdminGetProjectDetailsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
const Project_1 = require("../../../domain/entities/Project");
const ProjectPaymentRequest_1 = require("../../../domain/entities/ProjectPaymentRequest");
let AdminGetProjectDetailsUseCase = class AdminGetProjectDetailsUseCase {
    constructor(projectRepository, userRepository, paymentRepository, paymentRequestRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.paymentRequestRepository = paymentRequestRepository;
    }
    async execute(projectId) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        const creator = await this.userRepository.findById(project.clientId);
        if (!creator) {
            throw new AppError_1.NotFoundError('Project creator not found');
        }
        let contributor = null;
        if (project.acceptedContributor) {
            contributor = {
                id: project.acceptedContributor.id,
                name: project.acceptedContributor.name,
                avatarUrl: project.acceptedContributor.avatarUrl || null,
            };
        }
        // Get escrow info from Payment and ProjectPaymentRequest
        let escrow = null;
        if (project.paymentId) {
            const payment = await this.paymentRepository.findById(project.paymentId);
            if (payment && payment.status === PaymentEnums_1.PaymentStatus.SUCCEEDED) {
                // Determine escrow status based on project status and payment request
                let escrowStatus = 'HELD';
                let releaseTo = 'Pending';
                if (project.status === Project_1.ProjectStatus.COMPLETED) {
                    escrowStatus = 'RELEASED';
                    releaseTo = 'Contributor';
                }
                else if (project.status === Project_1.ProjectStatus.CANCELLED) {
                    escrowStatus = 'REFUNDED';
                    releaseTo = 'Creator';
                }
                else {
                    // Check if there's a processed payment request
                    const paymentRequests = await this.paymentRequestRepository.findByProjectId(projectId);
                    const processedRequest = paymentRequests.find(r => r.status === ProjectPaymentRequest_1.ProjectPaymentRequestStatus.APPROVED);
                    if (processedRequest) {
                        if (processedRequest.isReleaseRequest()) {
                            escrowStatus = 'RELEASED';
                            releaseTo = 'Contributor';
                        }
                        else if (processedRequest.isRefundRequest()) {
                            escrowStatus = 'REFUNDED';
                            releaseTo = 'Creator';
                        }
                    }
                }
                escrow = {
                    amountHeld: payment.amount,
                    status: escrowStatus,
                    releaseTo,
                };
            }
        }
        return {
            id: project.id,
            title: project.title,
            description: project.description,
            category: project.category,
            tags: project.tags,
            budget: project.budget,
            duration: project.duration,
            deadline: project.deadline ?? null,
            status: project.status,
            applicationsCount: project.applicationsCount,
            isSuspended: project.isSuspended,
            suspendedAt: project.suspendedAt ?? null,
            suspendReason: project.suspendReason ?? null,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            creator: {
                id: creator.id,
                name: creator.name,
                email: creator.email.value,
                avatarUrl: creator.avatarUrl || null,
                rating: creator.rating || 0,
            },
            contributor,
            escrow,
        };
    }
};
exports.AdminGetProjectDetailsUseCase = AdminGetProjectDetailsUseCase;
exports.AdminGetProjectDetailsUseCase = AdminGetProjectDetailsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IProjectPaymentRequestRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminGetProjectDetailsUseCase);
//# sourceMappingURL=AdminGetProjectDetailsUseCase.js.map