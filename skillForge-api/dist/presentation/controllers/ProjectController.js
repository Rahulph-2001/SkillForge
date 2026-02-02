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
exports.ProjectController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const messages_1 = require("../../config/messages");
let ProjectController = class ProjectController {
    constructor(createProjectUseCase, listProjectsUseCase, getProjectUseCase, getMyProjectsUseCase, getContributingProjectsUseCase, requestProjectCompletionUseCase, reviewProjectCompletionUseCase, responseBuilder) {
        this.createProjectUseCase = createProjectUseCase;
        this.listProjectsUseCase = listProjectsUseCase;
        this.getProjectUseCase = getProjectUseCase;
        this.getMyProjectsUseCase = getMyProjectsUseCase;
        this.getContributingProjectsUseCase = getContributingProjectsUseCase;
        this.requestProjectCompletionUseCase = requestProjectCompletionUseCase;
        this.reviewProjectCompletionUseCase = reviewProjectCompletionUseCase;
        this.responseBuilder = responseBuilder;
        this.listProjects = async (req, res, next) => {
            try {
                const filters = {
                    search: req.query.search,
                    category: req.query.category,
                    status: req.query.status,
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    limit: req.query.limit ? parseInt(req.query.limit) : 10,
                };
                const result = await this.listProjectsUseCase.execute(filters);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.PROJECT.FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProject = async (req, res, next) => {
            try {
                const { id } = req.params;
                const project = await this.getProjectUseCase.execute(id);
                const response = this.responseBuilder.success(project, messages_1.SUCCESS_MESSAGES.PROJECT.DETAILS_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMyProjects = async (req, res, next) => {
            try {
                // Assuming Request is extended with user, usually req.user.id
                const userId = req.user.id;
                const projects = await this.getMyProjectsUseCase.execute(userId);
                const response = this.responseBuilder.success(projects, messages_1.SUCCESS_MESSAGES.PROJECT.MY_PROJECTS_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getContributingProjects = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projects = await this.getContributingProjectsUseCase.execute(userId);
                const response = this.responseBuilder.success(projects, messages_1.SUCCESS_MESSAGES.PROJECT.CONTRIBUTING_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.requestCompletion = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                await this.requestProjectCompletionUseCase.execute(id, userId);
                const response = this.responseBuilder.success(null, messages_1.SUCCESS_MESSAGES.PROJECT.COMPLETION_REQUESTED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.reviewCompletion = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { decision } = req.body;
                const userId = req.user.id;
                await this.reviewProjectCompletionUseCase.execute(id, userId, decision);
                const response = this.responseBuilder.success(null, messages_1.SUCCESS_MESSAGES.PROJECT.COMPLETION_REVIEWED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.ProjectController = ProjectController;
exports.ProjectController = ProjectController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICreateProjectUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IListProjectsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IGetProjectUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IGetMyProjectsUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IGetContributingProjectsUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IRequestProjectCompletionUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IReviewProjectCompletionUseCase)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], ProjectController);
//# sourceMappingURL=ProjectController.js.map