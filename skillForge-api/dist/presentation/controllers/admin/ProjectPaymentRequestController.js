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
exports.ProjectPaymentRequestController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let ProjectPaymentRequestController = class ProjectPaymentRequestController {
    constructor(processUseCase, getPendingUseCase, responseBuilder) {
        this.processUseCase = processUseCase;
        this.getPendingUseCase = getPendingUseCase;
        this.responseBuilder = responseBuilder;
        this.getPendingPaymentRequests = async (_req, res, next) => {
            try {
                const requests = await this.getPendingUseCase.execute();
                const response = this.responseBuilder.success(requests, 'Pending payment requests fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.processPaymentRequest = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { approved, notes } = req.body;
                // Assuming admin ID is available in req.user from auth middleware
                const adminId = req.user.id;
                await this.processUseCase.execute(id, adminId, approved, notes);
                const message = approved ? 'Payment request approved and processed' : 'Payment request rejected';
                const response = this.responseBuilder.success(null, message, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.ProjectPaymentRequestController = ProjectPaymentRequestController;
exports.ProjectPaymentRequestController = ProjectPaymentRequestController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProcessProjectPaymentRequestUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetPendingPaymentRequestsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProjectPaymentRequestController);
//# sourceMappingURL=ProjectPaymentRequestController.js.map