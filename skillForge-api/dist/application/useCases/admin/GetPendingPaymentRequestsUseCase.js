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
exports.GetPendingPaymentRequestsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let GetPendingPaymentRequestsUseCase = class GetPendingPaymentRequestsUseCase {
    constructor(paymentRequestRepository, projectRepository, userRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async execute() {
        const requests = await this.paymentRequestRepository.findPending();
        const dtos = [];
        for (const req of requests) {
            try {
                const project = await this.projectRepository.findById(req.projectId);
                const requester = await this.userRepository.findById(req.requestedBy);
                if (project && requester && !project.isSuspended) {
                    dtos.push({
                        id: req.id,
                        projectId: req.projectId,
                        projectTitle: project.title,
                        type: req.type,
                        amount: req.amount,
                        requestedBy: {
                            id: requester.id,
                            name: requester.name,
                            email: requester.email.value
                        },
                        recipientId: req.recipientId,
                        status: 'PENDING',
                        createdAt: req.createdAt
                    });
                }
            }
            catch (error) {
                console.error(`Error fetching details for payment request ${req.id}:`, error);
            }
        }
        return dtos;
    }
};
exports.GetPendingPaymentRequestsUseCase = GetPendingPaymentRequestsUseCase;
exports.GetPendingPaymentRequestsUseCase = GetPendingPaymentRequestsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectPaymentRequestRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetPendingPaymentRequestsUseCase);
//# sourceMappingURL=GetPendingPaymentRequestsUseCase.js.map