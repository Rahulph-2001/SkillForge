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
exports.ApproveProjectCompletionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const Project_1 = require("../../../domain/entities/Project");
let ApproveProjectCompletionUseCase = class ApproveProjectCompletionUseCase {
    constructor(projectRepository, paymentRepository) {
        this.projectRepository = projectRepository;
        this.paymentRepository = paymentRepository;
    }
    async execute(projectId, clientId) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        if (project.clientId !== clientId) {
            throw new AppError_1.ForbiddenError('Only the project client can approve completion');
        }
        if (project.status !== Project_1.ProjectStatus.PENDING_COMPLETION) {
            throw new AppError_1.ValidationError('Project is not pending completion');
        }
        // 1. Update Project Status
        await this.projectRepository.updateStatus(projectId, Project_1.ProjectStatus.COMPLETED);
        // 2. Release Escrow / Update Payment Status
        if (project.paymentId) {
            // Industrial logic: Release payment to contributor wallet
            // For now, we update status. In real app, this triggers Stripe transfer or Wallet ledger update.
            const payment = await this.paymentRepository.findById(project.paymentId);
            if (payment) {
                payment.markAsReleased();
                await this.paymentRepository.update(payment);
            }
        }
    }
};
exports.ApproveProjectCompletionUseCase = ApproveProjectCompletionUseCase;
exports.ApproveProjectCompletionUseCase = ApproveProjectCompletionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __metadata("design:paramtypes", [Object, Object])
], ApproveProjectCompletionUseCase);
//# sourceMappingURL=ApproveProjectCompletionUseCase.js.map