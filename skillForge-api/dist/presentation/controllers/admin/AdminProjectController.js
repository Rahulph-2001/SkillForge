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
exports.AdminProjectController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const AdminSuspendProjectDTO_1 = require("../../../application/dto/admin/AdminSuspendProjectDTO");
let AdminProjectController = class AdminProjectController {
    constructor(listProjectsUseCase, getProjectStatsUseCase, getProjectDetailsUseCase, suspendProjectUseCase, processPaymentRequestUseCase, responseBuilder) {
        this.listProjectsUseCase = listProjectsUseCase;
        this.getProjectStatsUseCase = getProjectStatsUseCase;
        this.getProjectDetailsUseCase = getProjectDetailsUseCase;
        this.suspendProjectUseCase = suspendProjectUseCase;
        this.processPaymentRequestUseCase = processPaymentRequestUseCase;
        this.responseBuilder = responseBuilder;
        this.processPaymentRequest = async (req, res, next) => {
            try {
                const { requestId } = req.params;
                const { approved, notes, overrideAction } = req.body;
                const adminId = req.user.id; // From auth middleware
                await this.processPaymentRequestUseCase.execute(requestId, adminId, approved, notes, overrideAction);
                const response = this.responseBuilder.success(null, approved ? 'Payment request approved successfully' : 'Payment request rejected successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.listProjects = async (req, res, next) => {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 20;
                const search = req.query.search;
                const status = req.query.status;
                const category = req.query.category;
                const isSuspended = req.query.isSuspended === 'true' ? true : req.query.isSuspended === 'false' ? false : undefined;
                const result = await this.listProjectsUseCase.execute({
                    page,
                    limit,
                    search,
                    status,
                    category,
                    isSuspended
                });
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.PROJECT.FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProjectStats = async (_req, res, next) => {
            try {
                const stats = await this.getProjectStatsUseCase.execute();
                const response = this.responseBuilder.success(stats, 'Project statistics retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProjectDetails = async (req, res, next) => {
            try {
                const { projectId } = req.params;
                const details = await this.getProjectDetailsUseCase.execute(projectId);
                const response = this.responseBuilder.success(details, messages_1.SUCCESS_MESSAGES.PROJECT.DETAILS_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.suspendProject = async (req, res, next) => {
            try {
                const { projectId } = req.params;
                const adminId = req.user.id;
                const validated = AdminSuspendProjectDTO_1.AdminSuspendProjectRequestDTOSchema.parse(req.body);
                const result = await this.suspendProjectUseCase.execute(projectId, validated, adminId);
                const response = this.responseBuilder.success(result, 'Project suspended successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.AdminProjectController = AdminProjectController;
exports.AdminProjectController = AdminProjectController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminListProjectsUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IAdminGetProjectStatsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAdminGetProjectDetailsUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IAdminSuspendProjectUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IProcessProjectPaymentRequestUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], AdminProjectController);
//# sourceMappingURL=AdminProjectController.js.map