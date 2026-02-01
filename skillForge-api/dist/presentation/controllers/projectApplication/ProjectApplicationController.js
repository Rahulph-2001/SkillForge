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
exports.ProjectApplicationController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const GetReceivedApplicationsUseCase_1 = require("../../../application/useCases/projectApplication/GetReceivedApplicationsUseCase");
const CreateProjectApplicationDTO_1 = require("../../../application/dto/projectApplication/CreateProjectApplicationDTO");
const UpdateApplicationStatusDTO_1 = require("../../../application/dto/projectApplication/UpdateApplicationStatusDTO");
const messages_1 = require("../../../config/messages");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const AppError_1 = require("../../../domain/errors/AppError");
let ProjectApplicationController = class ProjectApplicationController {
    constructor(applyToProjectUseCase, getProjectApplicationsUseCase, updateStatusUseCase, getMyApplicationsUseCase, withdrawApplicationUseCase, getReceivedApplicationsUseCase, responseBuilder) {
        this.applyToProjectUseCase = applyToProjectUseCase;
        this.getProjectApplicationsUseCase = getProjectApplicationsUseCase;
        this.updateStatusUseCase = updateStatusUseCase;
        this.getMyApplicationsUseCase = getMyApplicationsUseCase;
        this.withdrawApplicationUseCase = withdrawApplicationUseCase;
        this.getReceivedApplicationsUseCase = getReceivedApplicationsUseCase;
        this.responseBuilder = responseBuilder;
    }
    async applyToProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const applicantId = req.user.userId;
            const validationResult = CreateProjectApplicationDTO_1.CreateProjectApplicationSchema.safeParse({ ...req.body, projectId });
            if (!validationResult.success) {
                throw new AppError_1.ValidationError(validationResult.error.message);
            }
            const application = await this.applyToProjectUseCase.execute(applicantId, validationResult.data);
            const response = this.responseBuilder.success(application, messages_1.SUCCESS_MESSAGES.PROJECT_APPLICATION.SUBMITTED, HttpStatusCode_1.HttpStatusCode.CREATED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async getProjectApplications(req, res, next) {
        try {
            const { projectId } = req.params;
            const userId = req.user.userId;
            const applications = await this.getProjectApplicationsUseCase.execute(projectId, userId);
            const response = this.responseBuilder.success(applications, messages_1.SUCCESS_MESSAGES.PROJECT_APPLICATION.FETCHED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const { applicationId } = req.params;
            const clientId = req.user.userId;
            const validationResult = UpdateApplicationStatusDTO_1.UpdateApplicationStatusSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new AppError_1.ValidationError(validationResult.error.message);
            }
            // Cast status to ProjectApplicationStatus enum
            const status = validationResult.data.status;
            const application = await this.updateStatusUseCase.execute(applicationId, clientId, status);
            const response = this.responseBuilder.success(application, messages_1.SUCCESS_MESSAGES.PROJECT_APPLICATION.UPDATED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async getMyApplications(req, res, next) {
        try {
            const applicantId = req.user.userId;
            const applications = await this.getMyApplicationsUseCase.execute(applicantId);
            const response = this.responseBuilder.success(applications, messages_1.SUCCESS_MESSAGES.PROJECT_APPLICATION.FETCHED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async withdrawApplication(req, res, next) {
        try {
            const { applicationId } = req.params;
            const applicantId = req.user.userId;
            const application = await this.withdrawApplicationUseCase.execute(applicationId, applicantId);
            const response = this.responseBuilder.success(application, messages_1.SUCCESS_MESSAGES.PROJECT_APPLICATION.WITHDRAWN);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async getReceivedApplications(req, res, next) {
        try {
            const userId = req.user.userId;
            const applications = await this.getReceivedApplicationsUseCase.execute(userId);
            const response = this.responseBuilder.success(applications, messages_1.SUCCESS_MESSAGES.PROJECT_APPLICATION.FETCHED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.ProjectApplicationController = ProjectApplicationController;
exports.ProjectApplicationController = ProjectApplicationController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IApplyToProjectUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetProjectApplicationsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUpdateApplicationStatusUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IGetMyApplicationsUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IWithdrawApplicationUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.GetReceivedApplicationsUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, GetReceivedApplicationsUseCase_1.GetReceivedApplicationsUseCase, Object])
], ProjectApplicationController);
//# sourceMappingURL=ProjectApplicationController.js.map