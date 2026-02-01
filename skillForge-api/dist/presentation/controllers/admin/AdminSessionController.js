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
exports.AdminSessionController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let AdminSessionController = class AdminSessionController {
    constructor(adminListSessionsUseCase, adminGetSessionStatsUseCase, adminCancelSessionUseCase, adminCompleteSessionUseCase, responseBuilder) {
        this.adminListSessionsUseCase = adminListSessionsUseCase;
        this.adminGetSessionStatsUseCase = adminGetSessionStatsUseCase;
        this.adminCancelSessionUseCase = adminCancelSessionUseCase;
        this.adminCompleteSessionUseCase = adminCompleteSessionUseCase;
        this.responseBuilder = responseBuilder;
        this.listSessions = async (req, res, next) => {
            try {
                const page = req.query.page ? parseInt(req.query.page) : 1;
                const limit = req.query.limit ? parseInt(req.query.limit) : 10;
                const search = req.query.search;
                const result = await this.adminListSessionsUseCase.execute(page, limit, search);
                const response = this.responseBuilder.success(result, 'Sessions listed successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getStats = async (_req, res, next) => {
            try {
                const stats = await this.adminGetSessionStatsUseCase.execute();
                const response = this.responseBuilder.success(stats, 'Session stats fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.cancelSession = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { reason } = req.body;
                const result = await this.adminCancelSessionUseCase.execute(id, reason || 'Cancelled by admin');
                const response = this.responseBuilder.success(result, 'Session cancelled successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.completeSession = async (req, res, next) => {
            try {
                const { id } = req.params;
                const result = await this.adminCompleteSessionUseCase.execute(id);
                const response = this.responseBuilder.success(result, 'Session marked as completed successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.AdminSessionController = AdminSessionController;
exports.AdminSessionController = AdminSessionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminListSessionsUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IAdminGetSessionStatsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAdminCancelSessionUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IAdminCompleteSessionUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AdminSessionController);
//# sourceMappingURL=AdminSessionController.js.map