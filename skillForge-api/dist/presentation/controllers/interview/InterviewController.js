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
exports.InterviewController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let InterviewController = class InterviewController {
    constructor(scheduleUseCase, getInterviewUseCase, responseBuilder) {
        this.scheduleUseCase = scheduleUseCase;
        this.getInterviewUseCase = getInterviewUseCase;
        this.responseBuilder = responseBuilder;
        this.schedule = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const result = await this.scheduleUseCase.execute(userId, req.body);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.INTERVIEW.SCHEDULED, HttpStatusCode_1.HttpStatusCode.CREATED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getByApplication = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { applicationId } = req.params;
                const result = await this.getInterviewUseCase.execute(userId, applicationId);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.INTERVIEW.FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.InterviewController = InterviewController;
exports.InterviewController = InterviewController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IScheduleInterviewUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetInterviewUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object])
], InterviewController);
//# sourceMappingURL=InterviewController.js.map