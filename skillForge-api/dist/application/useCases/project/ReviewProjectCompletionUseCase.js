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
exports.ReviewProjectCompletionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const ProjectPaymentRequest_1 = require("../../../domain/entities/ProjectPaymentRequest");
const Project_1 = require("../../../domain/entities/Project");
const uuid_1 = require("uuid");
let ReviewProjectCompletionUseCase = class ReviewProjectCompletionUseCase {
    constructor(projectRepository, paymentRequestRepository, applicationRepository) {
        this.projectRepository = projectRepository;
        this.paymentRequestRepository = paymentRequestRepository;
        this.applicationRepository = applicationRepository;
    }
    async execute(projectId, userId, decision, reason) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        if (project.clientId !== userId) {
            throw new AppError_1.ForbiddenError('Only the project owner can review completion');
        }
        // Validate project is in PENDING_COMPLETION status
        if (project.status !== Project_1.ProjectStatus.PENDING_COMPLETION) {
            throw new AppError_1.ValidationError(`Project must be in "Pending Completion" status to review. Current status: ${project.status}`);
        }
        // Get accepted contributor to pay
        const application = await this.applicationRepository.findAcceptedByProject(projectId);
        if (!application) {
            throw new AppError_1.NotFoundError('No accepted contributor found for this project');
        }
        if (decision === 'APPROVE') {
            // Create RELEASE payment request pending admin approval
            const paymentRequest = ProjectPaymentRequest_1.ProjectPaymentRequest.create({
                id: (0, uuid_1.v4)(),
                projectId: project.id,
                type: ProjectPaymentRequest_1.ProjectPaymentRequestType.RELEASE,
                amount: project.budget,
                requestedBy: userId,
                recipientId: application.applicantId,
                status: ProjectPaymentRequest_1.ProjectPaymentRequestStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await this.paymentRequestRepository.create(paymentRequest);
            project.markAsPaymentPending();
        }
        else if (decision === 'REJECT') {
            if (!reason) {
                throw new AppError_1.ValidationError('A reason is required to reject project completion');
            }
            // Create REFUND payment request pending admin approval - THIS IS NOW A DISPUTE
            const paymentRequest = ProjectPaymentRequest_1.ProjectPaymentRequest.create({
                id: (0, uuid_1.v4)(),
                projectId: project.id,
                type: ProjectPaymentRequest_1.ProjectPaymentRequestType.REFUND,
                amount: project.budget,
                requestedBy: userId,
                recipientId: userId, // Refund goes back to creator
                status: ProjectPaymentRequest_1.ProjectPaymentRequestStatus.PENDING,
                requesterNotes: reason, // Store the dispute reason here
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await this.paymentRequestRepository.create(paymentRequest);
            project.markAsRefundPending();
        }
        else if (decision === 'REQUEST_CHANGES') {
            project.revertToInProgress();
            // TODO: Notify contributor
        }
        else {
            throw new AppError_1.ValidationError('Invalid decision. Must be APPROVE, REJECT, or REQUEST_CHANGES');
        }
        await this.projectRepository.update(project);
    }
};
exports.ReviewProjectCompletionUseCase = ReviewProjectCompletionUseCase;
exports.ReviewProjectCompletionUseCase = ReviewProjectCompletionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectPaymentRequestRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ReviewProjectCompletionUseCase);
//# sourceMappingURL=ReviewProjectCompletionUseCase.js.map